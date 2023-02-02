import express  from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import dotenv from 'dotenv';
const app = express();
dotenv.config();


app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());

//always specify after app.use(cors)
app.use('/posts',postRoutes);
app.use('/user',userRoutes);

app.get("/", (req, res) => {
    res.send("Server is up and running");
  });

// const CONNECTION_URL = 'mongodb+srv://pradeep12:i7tkQKXD193GsVHd@cluster0.pdui5s7.mongodb.net/?retryWrites=true&w=majority'
// const CONNECTION_URL = 'mongodb+srv://Himanshu_Shriv:jvgFKzLZSRrpNghW@cluster0.lxjzwxr.mongodb.net/?retryWrites=true&w=majority'
const PORT = process.env.PORT||5000;
mongoose.set('strictQuery', true)

mongoose.connect(process.env.CONNECTION_URL,{useNewUrlParser: true, useUnifiedTopology:true})
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));

// mongoose.set('useFindAndModify', false);








