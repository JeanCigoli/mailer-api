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
    } else {
      deleteFiles(element);
    }
  }

  deleteFile(element) {
    console.log(element);
  }
}

export default new SendMail();
