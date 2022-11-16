import mongoose from "mongoose";

const userSchema = mongoose.Schema({

    
    phoneNumber: {
            type: String,
            required: [true, 'Please enter your number'],
            
        },
    Subscription:{
        type: Boolean,
        default: false
    },
    lengthOfSubscription:{
        type: Number,
        default: 0
    
    },
},
    {
        timestamps : true
    }
    )
 
var Subscription = mongoose.model('Subscription', userSchema);

export default Subscription;