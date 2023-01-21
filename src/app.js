require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const expressWinston = require('express-winston');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const responseTime = require('response-time');
const cors = require('cors');
const helmet = require('helmet');
const verifyJWT = require('./middleware/verifyJWT');
const connectDB = require('./modules/database/mongodb');
const { connection } = require('mongoose');
const mongoose = require('mongoose');
const validationErrorMiddleware = require('./middleware/validationError');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const options = require('./swagger/swagger_options');
const path = require('path')

const app = express();
app.set('port', process.env.PORT || 4000);

mongoose.set('strictQuery', true);
connectDB();

app.use(express.static(path.join(__dirname, '/public')));
app.use(responseTime());
app.use(credentials);
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(express.json());
app.use(
  '/api-swagger',
  swaggerUi.serve,
  swaggerUi.setup(swaggerJsdoc(options), { explorer: true })
);
app.use(cookieParser());
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.json(),
    statusLevels: true,
    meta: false,
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    expressFormat: true,
    ignoreRoute() {
      return false;
    },
  })
);

app.use('/api', require('./api/users'));
app.use('/api', require('./api/refresh'));

app.use(verifyJWT);
app.use('/api', require('./api/treatments'));

app.use(validationErrorMiddleware);

connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(app.get('port'), () => {
    console.log(`App listening on ${app.get('port')}`);
    console.log(
      `Swagger is up on http://localhost:${app.get('port')}/api-swagger/`
    );
  });
});
