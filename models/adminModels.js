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
      otpCode: {
        type: String,
      },
      isOtpVerified: {
        type: Boolean,
        default: false
      }

})
 
var Admin = mongoose.model('Admin', userSchema);

export default Admin;