import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import rimraf from 'rimraf';
import {
  apiResponse, apiErrorResponse, isNumber, nameValid, moveFiles,
} from '../utils/index';
import TemplateDao from '../dao/TemplateDao';

const asyncUnlink = promisify(fs.unlink);

class TemplateController {
  async store(req, res) {
    const { name, variables, imagesName } = req.body;
    let response = null;

    const re = /\s*,\s*/;

    const namePage = name.split('.');

    if (imagesName !== undefined) {
      const images = imagesName.split(re);

      const oldPath = path.join('src', 'views', 'img');

      const moved = moveFiles(images, oldPath, path.join(oldPath, namePage[0]));

      if (!moved) {
        response = apiErrorResponse({
          message: 'Erro no upload de imagem',
          errors: ['Erro no upload de imagem'],
        });

        return res.status(404).json(response);
      }
    }


    if (!nameValid(name)) {
      response = apiErrorResponse({
        message: 'Parâmetro enviado é inválido',
        errors: ['Parâmetro enviado é inválido'],
      });

      return res.status(404).json(response);
    }

    const templateExist = await TemplateDao.selectByNameTemplate(name);

    if (templateExist) {
      const payload = await TemplateDao.insertTemplate({ name, variables, images: imagesName });

      response = apiResponse({
        message: 'Arquivo cadastrado com sucesso',
        payload,
      });

      return res.json(response);
    }

    response = apiErrorResponse({
      message: 'Template já se encontra cadastrado',
      errors: ['Template já se encontra cadastrado'],
    });

    return res.status(404).json(response);
  }

  async show(req, res) {
    const { id } = req.params;
    let response = null;

    if (isNumber(id)) {
      let payload = null;

      payload = await TemplateDao.selectByIdTemplate(id);

      if (!payload) {
        response = apiErrorResponse({
          message: 'Template não encontrado',
          errors: ['Não foi encontrado o arquivo'],
        });

        return res.status(404).json(response);
      }

      response = apiResponse({
        message: 'Dados do seu template',
        payload,
      });

      return res.json(response);
    }

    response = apiErrorResponse({
      message: 'Parâmetro enviado é inválido',
      errors: ['Parâmetro enviado é inválido'],
    });

    return res.status(404).json(response);
  }

  async index(req, res) {
    let payload = [];
    let response = '';

    payload = await TemplateDao.selectAllTemplates();

    if (payload.length === 0) {
      response = apiResponse({
        message: 'Não possui templates cadastrados',
      });
    } else {
      response = apiResponse({
        message: 'Lista de templates cadastrados',
        payload,
      });
    }

    return res.json(response);
  }

  async delete(req, res) {
    const { name } = req.params;

    const nameArray = name.split('.');

    const fileName = path.join('src', 'views', 'layouts', name);
    const imageName = path.join('src', 'views', 'img', nameArray[0]);

    let response = null;

    if (!nameValid(name)) {
      response = apiErrorResponse({
        message: 'Parâmetro enviado é inválido',
        errors: ['Parâmetro enviado é inválido'],
      });

      return res.status(404).json(response);
    }

    try {
      await TemplateDao.deleteByTemplate(name);
      await asyncUnlink(fileName);

      rimraf(imageName, () => { });

      response = apiResponse({
        message: 'Arquivo deletado com sucesso',
      });

      return res.json(response);
    } catch (error) {
      response = apiErrorResponse({
        message: 'Não foi encontrado o arquivo',
        errors: ['Não foi encontrado o arquivo'],
      });

      return res.status(404).json(response);
    }
  }
}

export default new TemplateController();
