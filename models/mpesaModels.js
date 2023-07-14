import mongoose from "mongoose";

const callbackSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        unique: true,
      },
      phoneNumber: {
        type: String,
      },
      amount: {
        type: Number,
      },
      resultDesc: {
        type: String,
      },
    // Add other fields as needed
  });

var Transactions = mongoose.model('Callback', callbackSchema);

export default Transactions;