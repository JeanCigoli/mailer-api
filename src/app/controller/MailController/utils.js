import path from 'path';

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
    mailsTemp.to = to.email;
    mailsTemp.subject = mails.subject;

    if (mails.template === undefined) {
      const basename = mails.name.split('.');
      mailsTemp.template = `${basename[0]}`;
    } else {
      const basename = mails.template.split('.');
      mailsTemp.template = `temp/${basename[0]}`;
    }

    if (to.variables !== undefined) {
      mailsTemp.context = to.variables;
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
  name, template, from, to, subject, limit, delay_minutes, email_report, delay_init,
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

  if (!limit || !delay_minutes || !delay_init) {
    errors.push(['É necessário mandar os atributos obrigatórios: delay_init, delay_minutes e limit']);
    status = false;
  }

  if (!email_report) {
    errors.push(['É necessário mandar os atributos obrigatórios: email_report']);
    status = false;
  }

  if (to) {
    try {
      to = JSON.parse(to);

      to.forEach((toMail) => {
        if (!toMail.email || toMail.email === '') {
          errors.push(['O atributo mail de dentro de to está vazio']);
          status = false;
        }
      });
    } catch (error) {
      errors.push(['Objeto json no atributo (to) mal formado']);
      status = false;
    }
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

export const deleteFiles = ({ template, filenames, nameLog }) => {
  const files = {};

  if (template || filenames) {
    if (!template) {
      if (filenames !== undefined) {
        files.attachments = filenames;
      }
    } else {
      files.template = template;

      if (filenames !== undefined) {
        files.attachments = filenames;
      }
    }
  }

  files.log = nameLog;

  return files;
};

export const handleLog = () => {
  const name = `${Date.now()}${Math.floor(Math.random() * 100)}.txt`;

  return name;
};

export const handlerLogEmail = (from, log) => {
  const attachments = [];

  const name = from.split(' ');

  const mail = {
    from: 'Mailer <mailer@primi.com.br>',
    to: from,
    subject: 'Registro dos envios de E-mail',
    template: 'mailer',
    context: {
      name: name[0],
    },
  };

  attachments.push({
    filename: log,
    path: path.resolve('src', 'log', log),
  });

  mail.attachments = attachments;

  return mail;
};
