import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readdirAsync = promisify(fs.readdir);

const pathGet = path.resolve(__dirname, '..', '..', 'views');


class TemplateController {

    async store(req, res) {

        const { pageName, nome, objeto } = req.body;
        return res.render(pageName, { nome, objeto });

    };

    async index(req, res) {
        const names = await readdirAsync(pathGet);
        return res.json(names);
    };

    async delete(req, res) {

        const { name } = req.params;
        const fileName = path.join('src', 'views', name);

        fs.unlink(fileName, (err) => {
            if (err) throw err;
            return res.json({
                status: "success: archive deleted!"
            })
        });

    };

}

export default new TemplateController();
