import dotenv from 'dotenv';
/**
* load enviroment variables for development
* @return {void}
*/
export const load = (function () {
  if (!process.env.NODE_ENV) {
    dotenv.config();
  }
}());
