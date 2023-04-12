var express = require('express');
var axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })
const fileupload = require("express-fileupload");
var app = express();
// const client = require('filestack-js').init(API_KEY);
const API_KEY = process.env.API_KEY;
const policy = process.env.POLICY_KEY;
const signature = process.env.SIGNATURE_KEY;
const imageBaseUrl = process.env.IMAGE_BASEURL;
const controller = require('./controller/all');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileupload());

// get Images
app.get('/', async function (req, res) {
    const html = await controller.renderImages();
    res.send(html);
});

// get image
app.get('/:id', async function (req, res) {
    const imageId = req.url.replace('/', '');

    const response = await axios({
        url: `${imageBaseUrl}/${imageId}/metadata`,
    }).catch(error => {
        console.log(error);
        res.status(404);
        res.send('找不到圖片，請重新確認網址');
    });

    // console.log(response);

    const imgMeta = response.data;
    const { mimetype, size } = imgMeta;
    res.send(`
            <p>Type: ${mimetype}</p>
            <p>Size: ${Math.floor(size / 1000)} KB</p>
            <img src=${imageBaseUrl}/${imageId} width=500>
        `);
});

// upload image
app.post('/', async function (req, res) {
    try {
        const size = req.files.image.size;
        if (size > 500 * 1024) {
            res.send("圖片大小不得超過 500KB");
        } else {
            const mimetype = req.files.image.mimetype;
            const response = await axios({
                method: "post",
                url: `https://www.filestackapi.com/api/store/S3`,
                data: req.files.image.data,
                headers: { "Content-type": mimetype },
                params: {
                    key: API_KEY,
                    // policy,
                    // signature,
                },
            }).catch(error => {
                console.log(error);
                res.sendStatus(500);
            });
            // console.log('Upload Result:', response)
            const { url } = response.data;
            let html = '';

            if (url) {
                const imageId = url.split('/').pop();
                await controller.updateImages(imageId, 'add');
                html += '<h1 style="color:green">添加圖片成功</h1>';
            } else {
                html += '<h1 style="color:red">添加圖片失敗</h1>';
            }

            html += await controller.renderImages();
            res.send(html);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// delete image
app.delete('/:id', async function (req, res) {
    try {
        const imageId = req.url.replace('/', '');
        const response =
            await axios({
                method: "delete",
                url: `${imageBaseUrl}/${imageId}`,
                params: {
                    key: API_KEY,
                    policy,
                    signature,
                },
            }).catch(error => {
                console.log(error);
                res.sendStatus(500);
            });
        // console.log('Delete Result:', response)

        let html = '';

        if (response.status === 200) {
            await controller.updateImages(imageId, 'remove');
            html += '<h1 style="color:green">刪除圖片成功</h1>';
        } else {
            html += '<h1 style="color:red">刪除圖片失敗</h1>';
        }

        html += await controller.renderImages();
        res.send(html);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// Rewrite Image
app.post('/:id', async function (req, res) {
    try {
        const size = req.files.image.size;
        if (size > 500 * 1024) {
            res.send("圖片大小不得超過 500KB");
        } else {
            const imageId = req.url.replace('/', '');
            const mimetype = req.files.image.mimetype;
            const response = await axios({
                method: "post",
                url: `${imageBaseUrl}/${imageId}`,
                data: req.files.image.data,
                headers: { "Content-type": mimetype },
                params: {
                    // key: API_KEY,
                    policy,
                    signature,
                }
            }).catch(error => {
                console.log(error);
                res.sendStatus(500);
            });
            // console.log('Rewrite Result:', response)
            res.send(response.data);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// 監聽 port
var port = process.env.PORT || 3000;
app.listen(port);