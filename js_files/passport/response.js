var Photo = require('../models/photo');
function(req, id, done) {
    findOrCreateUser = function(){
        // find a user in Mongo with provided username
        Photo.findOne({ 'id' :  id }, function(err) {
            // In case of any error, return using the done method
            if (err){
                console.log('Error in Recording Response: '+err);
                return done(err);
            } else {
                // if there is no user with that email
                // create the user
                var newPhoto = new Photo();

                // set the user's local credentials
                newPhoto.id: ,
				photoname: String,
				predLabel: String,
				predLabelProbability: float,
				userLabelCnt: int,
				totalResponseCnt: int,
				category: String

                newUser.username = username;
                newUser.password = createHash(password);
                newUser.email = req.param('email');
                newUser.firstName = req.param('firstName');
                newUser.lastName = req.param('lastName');

                // save the user
                newUser.save(function(err) {
                    if (err){
                        console.log('Error in Saving user: '+err);  
                        throw err;  
                    }
                    console.log('User Registration succesful');    
                    return done(null, newUser);
                });
            }
        });
    };
    // Delay the execution of findOrCreateUser and execute the method
    // in the next tick of the event loop
    process.nextTick(findOrCreateUser);
})