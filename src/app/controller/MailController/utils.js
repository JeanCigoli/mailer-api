import path from 'path';
import TemplateDao from '../../dao/TemplateDao';
import AttachmentsDao from '../../dao/AttachmentsDao';

export const generateContextObject = (variables) => {
  const arrayVariables = [];

  variables.forEach((element) => {
    const { key, value } = element;
    arrayVariables[key] = value;
  });

  const context = { ...arrayVariables };

  return context;
};

export const generateAttachmentsObject = (namePath, mail) => {
  const attachments = [];

  const regex = /\s*,\s*/;
  let success;

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

    success = true;
  }

  if (mail.attachments) {
    mail.attachments.forEach((element) => {
      const appendix = AttachmentsDao.selectByIds(element);

      if (appendix !== null) {
        const pathAttachments = path.join('src', 'views', 'attachments');

        appendix.forEach((attach) => {
          attachments.push({
            filename: attach.name,
            path: path.resolve(pathAttachments, attach.name),
          });
        });

        success = true;
      }
    });
  }


  if (success === true) {
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

    const attachments = generateAttachmentsObject(template.name, mail);

    if (attachments !== undefined) {
      mail.attachments = attachments;
    }

    mail.template = template.name;

    return mail;
  });

  return dataEmail;
};
