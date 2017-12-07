var helpers = require('../config/helperFunctions');
var userModel = require('../models/userModel');
var users = {}
var max_user_id = 0;

module.exports = function(server){
    server.get('/', function(req, res, next){
    userModel.find({},function(err,users){
    
      helpers.success(res,next,users);
    });
    });
    
    server.del('/user/:id', function(req, res, next){
      req.assert('id','Id is required and must be numeric').notEmpty();
      var errors = req.validationErrors();
      if(errors){
        helpers.failure(res,next,'The specified user couldnot be found in the database',404);
      }
      var user = users[parseInt(req.params.id)];
      userModel.findOne({ _id: req.params.id }, function (err, user) {
        if (err) {
          helpers.failure(res, next, 'Something went wrong while fetching the user from the database', 500);
          return next();
        }
        if (user === null) {
          helpers.failure(res, next, 'The specified user could not be found', 404);
          return next();
        }
       user.remove(function(err){
            helpers.failure(res,next,"Error removing user from the database",500);
          });
              
        helpers.success(res, next, user);
      
      });


    });
    //com 
  	server.get("/user/:id", function(req, res, next) {
      req.assert('id', 'Id is required and must be numeric').notEmpty();
      var errors = req.validationErrors();
      if (errors) {
        helpers.failure(res, next, errors[0], 400);
        return next();
      }
      userModel.findOne({ _id: req.params.id }, function (err, user) {
        if (err) {
          helpers.failure(res, next, 'Something went wrong while fetching the user from the database', 500);
          return next();
        }
        if (user === null) {
          helpers.failure(res, next, 'The specified user could not be found', 404);
          return next();
        }
        helpers.success(res, next, user);
      
      });
    });
      
    
    server.post('/user', function(req, res, next){
      req.assert('first_name','First name is required').notEmpty();
      req.assert('last_name','Last name is required').notEmpty();
      req.assert('email_address','Email is required and must be valid').notEmpty().isEmail();
      req.assert('career','Career must be either student, teacher or professor').isIn(['student','teacher','professor']);
      var errors = req.validationErrors();
      if(errors){
        helpers.failure(res,next,errors,400);
      }

      
      var user = new userModel();
      user.first_name = req.params.first_name;
      user.last_name = req.params.last_name;
      user.email_address = req.params.email_address;
      user.career = req.params.career;
      user.save(function(err){
        helpers.failure(res,next,"Error saving user to the database",500);
      });
      
      
    helpers.success(res,next,user);  
    });
    
      server.put('/user/:id', function(req, res, next){
        req.assert('id','Id is required and must be numeric').notEmpty();
        var errors = req.validationErrors();
        if(errors){
          helpers.failure(res,next,'The specified user couldnot be found in the database',404);
        }
        var user = users[parseInt(req.params.id)];
        userModel.findOne({ _id: req.params.id }, function (err, user) {
          if (err) {
            helpers.failure(res, next, 'Something went wrong while fetching the user from the database', 500);
            return next();
          }
          if (user === null) {
            helpers.failure(res, next, 'The specified user could not be found', 404);
            return next();
          }

          var updates = req.params;
          delete updates.id;
          for(var field in updates)
            user[field] = updates[field];
          
         user.save(function(err){
              helpers.failure(res,next,"Error saving user to the database",500);
            });
                
          helpers.success(res, next, user);
        
        });


        
        

        });
    }  
    