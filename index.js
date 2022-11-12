import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import postRoutes from './routes/posts.js';
import usersRoutes from './routes/userRoutes.js';
//import jobRoutes from './routes/jobRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import darajaRoutes from './routes/daraja.js';
import dotenv from 'dotenv';


const app = express();
dotenv.config();
app.use(bodyParser.json({limit:"30mb",extended:true}))
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))
app.use(cors());
app.use('/posts', postRoutes);
app.use('/users', usersRoutes);
app.use('/jobs', jobRoutes);
app.use('/daraja', darajaRoutes);

const CONNECTION_URL = 'mongodb+srv://odhis101:natasha12@cluster0.r1d9hq1.mongodb.net/?retryWrites=true&w=majority';

const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>app.listen(PORT,()=>console.log(`Server running on port: ${PORT}`)))
.catch((error)=>console.log(error.message));

