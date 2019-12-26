import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import {
  apiResponse, apiErrorResponse, isNumber, nameValid,
} from '../utils/index';
import TemplateDao from '../dao/TemplateDao';

const asyncUnlink = promisify(fs.unlink);

class TemplateController {
  async store(req, res) {
    const { name, variables } = req.body;
    let response = null;

    if (nameValid(name)) {
      const payload = await TemplateDao.insertTemplate({ name, variables });

      response = apiResponse({
        message: 'Arquivo cadastrado com sucesso',
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

  async show(req, res) {
    const { id } = req.params;
    let response = null;

    if (!isNumber(id)) {
      let payload = null;

      payload = await TemplateDao.selectByIdTemplate(id);

      if (payload.length === 0) {
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
    const fileName = path.join('src', 'views', name);
    let response = null;

    if (!nameValid(name)) {
      response = apiErrorResponse({
        message: 'Parâmetro enviado é inválido',
        errors: ['Parâmetro enviado é inválido'],
      });

      return res.status(404).json(response);
    }

    await TemplateDao.deleteByTemplate(name);

    try {
      await asyncUnlink(fileName);

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
