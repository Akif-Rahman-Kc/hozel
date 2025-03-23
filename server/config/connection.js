import { Router } from 'express';
import { set, connect } from "mongoose";
const router = Router();

const mongoDB ="mongodb+srv://akifrahman90442:qywfACfKU8tKD7wd@cluster0.dofti.mongodb.net/hostelmanagement";
set('strictQuery', false);
connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Connected");
}).catch((err)=>{
    console.log("Connection failed",err);
})

export default router;