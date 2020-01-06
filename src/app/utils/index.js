import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const asyncUnlink = promisify(fs.unlink);

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
    if (fs.existsSync(path.join(newPath, namePath))) {
      success = false;

      try {
        asyncUnlink(path.join(oldPath, namePath));
      } catch (error) {
        console.log(error);
      }
    }

    if (success) {
      fs.rename(path.join(oldPath, namePath), path.join(newPath, namePath), (err) => {
        if (err) {
          success = false;
        }
      });

      success = true;
    }
  });


  return success;
};
