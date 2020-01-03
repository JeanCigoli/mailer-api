import sqlite from '../../config/database';

class AttachmentsDao {
  insertAttachments({ name }) {
    const id = sqlite.insert('tb_attachments', { name });

    const json = {
      name,
      id,
    };

    return json;
  }

  async selectAllAttachments() {
    let data;

    await sqlite.runAsync('SELECT * FROM tb_attachments', (rows) => {
      data = rows;
    });

    return data;
  }

  selectByIds(ids) {
    let data;

    const row = sqlite.run('SELECT * FROM tb_attachments WHERE id IN (?)', [ids]);

    if (row.length === 0) {
      data = null;
    } else {
      data = row;
    }

    return data;
  }
}

export default new AttachmentsDao();
