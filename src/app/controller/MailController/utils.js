import path from 'path';
import TemplateDao from '../../dao/TemplateDao';

export const generateContextObject = (variables) => {
  const arrayVariables = [];

  variables.forEach((element) => {
    const { key, value } = element;
    arrayVariables[key] = value;
  });

  const context = { ...arrayVariables };

  return context;
};

export const generateAttachmentsObject = (namePath) => {
  const attachments = [];

  const regex = /\s*,\s*/;

  const images = TemplateDao.selectImagesByNameTemplate(`${namePath}.hbs`);

  if (images !== null) {
    const imagesName = images[0].images.split(regex);

    const pathImage = path.join('src', 'views', 'img', namePath);

    imagesName.forEach((name) => {
      attachments.push({
        filename: name,
        path: path.join(pathImage, name),
        cid: name,
      });
    });

    return attachments;
  }

  return undefined;
};

export const handlerEmail = (mails) => {
  const dataEmail = mails.map((mail) => {
    const { template } = mail;

    if (template.variables !== undefined && template.variables.length > 0) {
      mail.context = generateContextObject(template.variables);
    }

    const attachments = generateAttachmentsObject(template.name);

    if (attachments !== undefined) {
      mail.attachments = attachments;
    }

    mail.template = template.name;

    return mail;
  });

  return dataEmail;
};
