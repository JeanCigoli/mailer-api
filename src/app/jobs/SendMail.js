import Mail from '../../lib/Mail';


class SendMail {
  get key() {
    return 'SendMail';
  }

  async handle({ data }) {
    const { element } = data;

    await Mail.sendEmail(element);
  }
}

export default new SendMail();
