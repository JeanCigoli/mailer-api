
import sqlite from '../../config/database';

class TemplateDao {
  async insertTemplate({ name, variables, images }) {
    let json;

    await sqlite.insert('tb_templates', { name, variables, images }, (res) => {
      json = {
        name,
        location: `localhost:3000/templates/${name}`,
        code: res,
      };
    });

    return json;
  }

  async selectAllTemplates() {
    let data;

    await sqlite.runAsync('SELECT * FROM tb_templates', (rows) => {
      data = rows;
    });

    return data;
  }

  async selectByIdTemplate(id) {
    let data;

    await sqlite.runAsync('SELECT * FROM tb_templates WHERE id = ? ', [id], (row) => {
      if (row.length === 0) {
        data = false;
      } else {
        data = row;
      }
    });

    return data;
  }

  async selectByNameTemplate(name) {
    let data;

    await sqlite.runAsync('SELECT * FROM tb_templates WHERE name = ? ', [name], (row) => {
      if (row.length > 0) {
        data = false;
      } else {
        data = row;
      }
    });

    return data;
  }

  selectImagesByNameTemplate(name) {
    let data;

    const row = sqlite.run('SELECT images FROM tb_templates WHERE name = ? ', [name]);

    if (row.length === 0) {
      data = null;
    } else {
      data = row;
    }

    return data;
  }

  async deleteByTemplate(name) {
    let data;

    await sqlite.runAsync('DELETE FROM tb_templates WHERE name = ?', [name], (ok) => {
      data = ok;
    });

    return data;
  }
}

export default new TemplateDao();
