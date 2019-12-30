import sqlite from 'sqlite-sync';
import path from 'path';

const fileName = path.join('src', 'database', 'database.db');

sqlite.connect(fileName);

sqlite.run('CREATE TABLE tb_templates (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, variables TEXT NOT NULL, images TEXT NULL );');

export default sqlite;
