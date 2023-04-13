# FileStack Demo
[Demo](https://filestack-practice.onrender.com/)

Download and import [postman_collection.json](https://github.com/bell881122/filestack-practice/blob/main/Filestack-Test(demo).postman_collection.json) to test API with postman.

## Params
**[GET] GetAllImages**
none

**[GET] GetImageById**
url: '/:id'

**[DELETE] DeleteImageById**
url: '/:id'

**[POST] PostImagefromBody**
body: {
  image: 'formdata'
}

**[POST]PatchImageById**
url: '/:id'
body: {
  image: 'formdata'
}

# Dependencies
- axios: "^1.3.5"
- dotenv: "^16.0.3"
- express: "^4.16.2"
- express-fileupload: "^1.4.0"
- filestack-js: "^3.26.1"
