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
  const mailsTemplate = [];

  const context = JSON.parse(mails.to);

  context.forEach((to) => {
    const mailsTemp = {};

    mailsTemp.from = mails.from;
    mailsTemp.to = to.mail;
    mailsTemp.subject = mails.subject;

    if (mails.template === undefined) {
      const basename = mails.name.split('.');

      const [name] = basename;
      mailsTemp.template = name;
    } else {
      const basename = mails.template.split('.');
      mailsTemp.template = `temp/${basename[0]}`;
    }

    if (to.variables !== undefined) {
      mailsTemp.context = generateContextObject(to.variables);
    }

    const attachments = generateAttachmentsObject(mails.filenames);

    if (attachments !== undefined) {
      mailsTemp.attachments = attachments;
    }

    mailsTemplate.push(mailsTemp);
  });

  return mailsTemplate;
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

  if (to) {
    to = JSON.parse(to);

    to.forEach((toMail) => {
      if (!toMail.mail || toMail.mail === '') {
        errors.push(['O atributo mail de dentro de to está vazio']);
        status = false;
      }
    });
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


export const deleteFiles = ({ template, filenames }) => {
  let files;

  if (template || filenames) {
    if (!template) {
      if (filenames !== undefined) {
        files = { attachments: filenames };
      }
    } else {
      files = { template };

      if (filenames !== undefined) {
        files.attachments = filenames;
      }
    }
  }

  return files;
};
