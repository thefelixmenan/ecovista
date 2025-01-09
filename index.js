import express from 'express';
import fileUpload from "express-fileupload";
import path from 'path';
import { vegetateImage } from './getcomfy.js';
const app = express();
const port = 3000;

app.use(fileUpload());

app.use(express.static('public'));

app.use('/image_input', express.static('image_input'));
app.use('/image_output', express.static('image_output'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/upload', (req, res) => {
    try {
        const { image } = req.files;
        const filename = image.name;
        image.mv(`image_input/${filename}`, async (err) => {
            if(err) {
                res.status(500).send(err);
            }
            // res.send(`<img src="/image_input/${filename}" />`);
            const inputImgName = await vegetateImage(filename);
            console.log('inputImgName', inputImgName);
            res.send(`<img src="/image_input/${filename}" />
                <img src="/image_output/${inputImgName}" />`);
            // res.redirect(`/?inputImgName=${filename}&outputImgName=${inputImgName}`);
        });
    } catch (error) {
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
}); 