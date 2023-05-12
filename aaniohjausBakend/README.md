# Ääniohjaus - Backend

This is the backend implementation of Ääniohjaus app. It is used by both React Native and Android versions of Ääniohjaus.

## Getting started

The following instructions will help you get a copy of Ääniohjaus application's backend for development and testing purposes.


## Installing

1. Clone repository: `git clone https://github.com/Depajo/ohjelmistotuotannon-projekti.git`
2. Move to folder: `cd ohjelmistotuotannon-projekti/aaniohjausBakend`
3. Install the necessary dependencies: `npm install`
4. Pay attention to .env before trying to start!! 
    ### Usage of .env
Make an .env file to the root directory (aaniohjausBakend) with the following data:
```
HOST="<your hostaddress>"
DBUSER="<your username>"
PASSWORD="<your password>"
DATABASE="<your database>"
```

5. Run locally : 
    `nodemon index.js`

6. Run tests locally : 
    `npm run test`

## Dependencies

This app uses the following dependencies:

- [**Dotenv**](https://www.npmjs.com/package/dotenv) for environment variables (.env)
- [**Express**](https://expressjs.com/) as framework for backend
- [**Joi**](https://joi.dev/api/?v=17.9.1) for data validation
- [**mysql**](https://www.npmjs.com/package/mysql) for database connection
- [**Supertest**](https://www.npmjs.com/package/supertest) for creating tests  
- [**Jest**](https://jestjs.io/) for creating tests  

## License

This project is licensed under the MIT License - see the LICENSE file for details.