import fs from 'fs';
import path from 'path';
import { apiResponse, apiErrorResponse } from '../utils/index';
import sqlite from '../../config/database';


class TemplateController {
  async store(req, res) {
    const { pageName } = req.body;
    let data = {};

    sqlite.insert('tb_templates', { name: pageName, variables: 'nome, objeto' }, (id) => {
      data = {
        name: pageName,
        location: `localhost:3000/templates/${pageName}`,
        code: id,
      };
    });

    const response = apiResponse({
      message: 'Arquivo cadastrado com sucesso',
      data,
    });

    return res.json(response);
  }

  async show(req, res) {
    const { id } = req.params;
    let data = [];

    sqlite.runAsync('SELECT * FROM tb_templates WHERE id = ? ', [id], (rows) => {
      data = rows;
      console.log(rows);
    });

    if (data.length === 0) {
      const response = apiErrorResponse({
        message: 'Template não encontrado',
        errors: ['Não foi encontrado o arquivo'],
      });

      return res.status(404).json(response);
    }

    const response = apiResponse({
      message: 'Dados do seu template',
      data,
    });

    return res.json(response);
  }

  async index(req, res) {
    let data = [];
    let response = '';

    sqlite.runAsync('SELECT * FROM tb_templates', (rows) => {
      data = rows;
    });

    if (data.length === 0) {
      response = apiResponse({
        message: 'Não possui templates cadastrados',
      });
    } else {
      response = apiResponse({
        message: 'Lista de templates cadastrados',
        data,
      });
    }

    return res.json(response);
  }

  async delete(req, res) {
    const { name } = req.params;
    const fileName = path.join('src', 'views', name);

    fs.unlink(fileName, (err) => {
      if (err) {
        const response = apiErrorResponse({
          message: 'Não foi encontrado o arquivo',
          errors: ['Não foi encontrado o arquivo'],
        });

        return res.status(404).json(response);
      }

      const response = apiResponse({
        message: 'Arquivo deletado com sucesso',
      });

      return res.json(response);
    });
  }
}

export default new TemplateController();
