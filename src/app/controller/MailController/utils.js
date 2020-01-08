import path from 'path';

export const generateContextObject = (variables) => {
  const arrayVariables = [];

  variables.forEach((element) => {
    const { key, value } = element;
    arrayVariables[key] = value;
  });

  const context = { ...arrayVariables };

  return context;
};

export const generateAttachmentsObject = (mail) => {
  const attachments = [];

  let success;

  if (mail) {
    mail.forEach((appendix) => {
      if (appendix !== null) {
        const pathAttachments = path.join('src', 'views', 'attachments');

        attachments.push({
          filename: appendix,
          path: path.resolve(pathAttachments, appendix),
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
  const context = JSON.parse(mails.variables);


  if (mails.template === undefined) {
    const basename = mails.name.split('.');

    const [name] = basename;
    mails.template = name;
  } else {
    const basename = mails.template.split('.');
    mails.template = `temp/${basename[0]}`;
  }

  if (context !== undefined) {
    mails.context = generateContextObject(context);
  }

  const attachments = generateAttachmentsObject(mails.filenames);

  if (attachments !== undefined) {
    mails.attachments = attachments;
  }

  delete mails.name;
  delete mails.variables;
  delete mails.filenames;

  return mails;
};

export const mailValidate = ({
  name, template, from, to, subject,
}) => {
  const errors = [];
  let status = true;

  if (!name && !template) {
    errors.push(['É necessário mandar o atributo: name ou template']);
    status = false;
  }

  if (!from || !to || !subject) {
    errors.push(['É necessário mandar os atributos obrigatórios: from, to e subject']);
    status = false;
  }

  if (!status) {
    const response = {
      status,
      errors,
    };

    return response;
  }

  return { status };
};
