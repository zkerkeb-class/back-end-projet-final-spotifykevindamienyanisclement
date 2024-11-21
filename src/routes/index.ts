const express = require('express');
const authRoute = require('./auth.route');

const router = express.Router();

router.use(
    '/auth',
    authRoute,
    /* 
  #swagger.tags = ['Auth']     

  #swagger.security = [{         
      "apiKeyAuth": []            
  }] 
  */
);

module.exports = router;
