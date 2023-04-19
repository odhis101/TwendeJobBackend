
import mongoose from "mongoose";

const smsText = mongoose.Schema({

    phoneNumber: {
        type: String,
        required: [false, 'Please enter the phoneNumber'],
    },  
    messageText: {
        type: String,
        required: [true, 'Please enter the message'],
    },
    createdAt: {
        type: Date,
        default: new Date().toISOString().slice(0, 10)

},
}
)

var SmsText = mongoose.model('smsText', smsText)
export default SmsText;