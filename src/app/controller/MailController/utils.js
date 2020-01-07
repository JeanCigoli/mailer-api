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
