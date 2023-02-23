import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';


import postRoutes from './routes/posts.js';
import usersRoutes from './routes/userRoutes.js';
//import jobRoutes from './routes/jobRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import darajaRoutes from './routes/daraja.js';
import skillRoutes from './routes/skillRoutes.js';
import dotenv from 'dotenv';
import sms from './routes/sms.js';
import fileupload from 'express-fileupload';


const app = express();
dotenv.config();
app.use(bodyParser.json({limit:"30mb",extended:true}))
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))
app.use(cors());

app.use(fileupload());
app.use('/posts', postRoutes);
app.use('/users', usersRoutes);
app.use('/jobs', jobRoutes);
app.use('/daraja', darajaRoutes);
app.use('/messages', sms);
app.use('/skills', skillRoutes);


const CONNECTION_URL = 'mongodb+srv://odhis101:natasha12@cluster0.r1d9hq1.mongodb.net/?retryWrites=true&w=majority';

const PORT = process.env.PORT || 8080;

mongoose.connect(CONNECTION_URL,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>app.listen(PORT,()=>console.log(`Server running on port: ${PORT}`)))
.catch((error)=>console.log(error.message));

