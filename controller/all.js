
var axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' })
const imageBaseUrl = process.env.IMAGE_BASEURL;
const dataBaseId = process.env.DATABASE_ID;
const API_KEY = process.env.API_KEY;
const policy = process.env.POLICY_KEY;
const signature = process.env.SIGNATURE_KEY;

async function getImages(req, res) {
    const response = await axios({
        url: `${imageBaseUrl}/${dataBaseId}`,
        headers: { "Content-type": 'application/json' },
    }).catch(error => {
        console.log(error);
        res.sendStatus(500);
    });
    const images = response.data;
    return images;
}

async function renderImages() {
    const images = await getImages();
    let html = `<div style="
        display: flex;
        flex-wrap: wrap;
    ">`;
    let index = 1;
    for (let img of images) {
        html += `
        <div style="
            margin-right: 10px;
            text-align:center;
        ">
            <a href="https://cdn.filestackcontent.com/${img}" target="_blank">
                <h1>圖片 ${index.toString().padStart(2, '0')}</h1>
            </a>
            <p>ID: ${img}</p>
            <img src="https://cdn.filestackcontent.com/${img}" width="200">
        </div>
        `;
        index++;
    }
    html += "</div>"

    return html;
}

async function updateImages(image, type) {
    const images = await getImages();

    if (type === 'add') {
        images.push(image);
    } else {
        images.splice(images.indexOf(image), 1);
    }
    console.log(images);

    const response = await axios({
        method: "post",
        url: `${imageBaseUrl}/${dataBaseId}`,
        data: JSON.stringify(images),
        headers: { "Content-type": 'application/json' },
        params: {
            key: API_KEY,
            policy,
            signature,
        },
    }).catch(error => {
        console.log(error);
        res.sendStatus(500);
    });
    console.log('Update Success:', response.data);
}

module.exports = {
    getImages,
    renderImages,
    updateImages,
};