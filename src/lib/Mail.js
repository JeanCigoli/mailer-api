import nodemailer from 'nodemailer';
import { resolve } from 'path';
import nodemailerhbs from 'nodemailer-express-handlebars';
import exphbs from 'express-handlebars';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const {
      host, port, secure, auth,
    } = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'views', 'layouts');

    this.transporter.use('compile', nodemailerhbs({
      viewEngine: exphbs.create({
        layoutsDir: viewPath,
        partialsDir: viewPath,
        defaultLayout: resolve(viewPath, 'default', 'main'),
        extname: '.hbs',
      }),
      viewPath,
      extName: '.hbs',
    }));
  }

  sendEmail(message) {
    return this.transporter.sendMail({
      ...message,
    });
  }
}

export default new Mail();
