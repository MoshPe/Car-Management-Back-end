const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Car-Management-Service Backend',
      version: '1.0.0',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Moshe Peretz & Tal-Chen Ben-Eliyahu',
        url: 'https://car-management-back-end.vercel.app/api/',
        email: 'Moshe.peretz318@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000/api',
      },
      {
        url: 'https://car-management-back-end.vercel.app/api',
      },
    ],
  },
  customCssUrl: '/public/swagger-ui.css',
  apis: ['./src/api/*.js'],
};

module.exports = options;
