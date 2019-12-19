import app from './app';
import path from 'path'


app.set('views', path.join(__dirname, 'views'));


app.listen(3000, () => {
    console.log("Estou na porta 3000");
});


