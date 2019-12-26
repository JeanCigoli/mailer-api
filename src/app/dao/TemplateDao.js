import sqlite from '../../config/database';

class TemplateDao {
  async insertTemplate({ name, variables }) {
    const id = await sqlite.insert('tb_templates', { name, variables });

    const json = {
      name,
      location: `localhost:3000/templates/${name}`,
      code: id,
    };

    return json;
  }

  async selectAllTemplates() {
    const rows = await sqlite.run('SELECT * FROM tb_templates');
    return rows;
  }

  async selectByIdTemplate(id) {
    const row = await sqlite.run('SELECT * FROM tb_templates WHERE id = ? ', [id]);
    return row;
  }

  async deleteByTemplate(name) {
    const data = await sqlite.run('DELETE FROM tb_templates WHERE name = ?', [name]);
    return data;
  }
}

export default new TemplateDao();
