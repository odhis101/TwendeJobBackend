import mongoose from "mongoose";

const userSchema = mongoose.Schema({

    
    phoneNumber: {
            type: String,
            required: [true, 'Please enter your number'],
            
        },
        
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        
    },
    
    
    
    
    
    },
    {
        timestamps : true
    }
    )
 
var User = mongoose.model('User', userSchema);

export default User;