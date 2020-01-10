import Mail from '../../lib/Mail';
import { deleteFiles } from '../utils';

class SendMail {
  get key() {
    return 'SendMail';
  }

  async handle({ data }) {
    const { element } = data;

    if (!element.status) {
      await Mail.sendEmail(element);
    }

    if (element.status) {
      setTimeout(() => {
        deleteFiles(element);
      }, 10000);
    }
  }
}

export default new SendMail();
