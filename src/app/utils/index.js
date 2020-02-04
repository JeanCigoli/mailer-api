import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

// Retorno da api

export function apiResponse({
  success = true, message = '', payload = {}, errors = [],
}) {
  return ({
    success,
    message,
    payload,
    errors,
  });
}

export function apiErrorResponse({ message = '', errors = [] }) {
  const error = errors.map((description) => ({
    code: 999,
    description,
  }));

  return apiResponse({ success: false, message, errors: error });
}

// Verificações

export const isNumber = (number) => /^[0-9]+$/.test(number);

export const nameValid = (string) => /[a-zA-Z0-9_]+.hbs/.test(string);

// Deletando arquivos

const asyncUnlink = promisify(fs.unlink);

export const deleteFiles = (files) => {
  const templatePath = path.resolve('src', 'views', 'layouts', 'temp');
  const attachmentsPath = path.resolve('src', 'views', 'attachments');

  if (!files.template) {
    if (files.attachments !== undefined) {
      files.attachments.forEach((attachment) => {
        asyncUnlink(path.join(attachmentsPath, attachment));
      });
    }
  } else {
    asyncUnlink(path.join(templatePath, files.template));

    if (files.attachments !== undefined) {
      files.attachments.forEach((attachment) => {
        asyncUnlink(path.join(attachmentsPath, attachment));
      });
    }
  }
};
