
'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
const expect = require('expect');
const server = require('../lib/server.js');

describe('testing server', () => {
  it('should respond with a stop server error', () => {
    return server.stop()
      .catch((err) => {
        expect(err.message).toEqual('The server is already stopped');
      });
  });
});
