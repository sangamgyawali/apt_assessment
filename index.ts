import express, { Request, Response, response } from 'express';
import bodyParser from 'body-parser';
import * as http from 'https';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';

const app = express();
const port = 30000;

// Middleware
app.use(bodyParser.json());

// Routes
app.post('/ping', async (req: Request, res: Response) => {
  try {
    const message = req.body.message;
    const options = {
      hostname: 'www.postman-echo.com',
      path: '/get?message=${message}',
      method: 'GET'
    };
    const request = http.request(options,(response) =>{
      response.setEncoding("utf8");
      response.on('data', function(data) {
        const timestamp = Date.now();
        const env = process.env.NODE_ENV || 'development';
        const version = process.env.VERSION || '1.0.0';
        
        res.json({
          echo: data,
          timestamp,
          env,
          version
      })
      })
    });
    request.end();
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});