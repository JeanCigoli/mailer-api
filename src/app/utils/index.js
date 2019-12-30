import fs from 'fs';
import path from 'path';


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

export const isNumber = (number) => /^[0-9]+$/.test(number);

export const nameValid = (string) => /[a-zA-Z0-9_]+.hbs/.test(string);

export const moveFiles = (arrayFiles, oldPath, newPath) => {
  let success = true;

  if (!fs.existsSync(newPath)) {
    fs.mkdirSync(newPath);
  }

  arrayFiles.forEach((namePath) => {
    fs.rename(path.join(oldPath, namePath), path.join(newPath, namePath), (err) => {
      if (err) {
        success = false;
      }
    });
  });


  return success;
};
