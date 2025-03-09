import { Schema, model } from 'mongoose';

const studentSchema = new Schema({
    student_id:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    mobile_no:{
        type:String,
        required:true,
        trim:true
    },
    parent_mobile_no:{
        type: String,
        required: true,
        trim: true
    },
    age:{
        type:String,
        required:true,
        trim:true
    },
    gender:{
        type:String,
        required:true,
        trim:true
    },
    year:{
        type:String,
        required:true,
        trim:true
    },
    department:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    room_no:{
        type: String,
        required: true,
        trim: true,
    },
    status:{
        type: String,
        required: true,
        trim: true,
        default: "ACTIVE"
    },
    created_at:{
        required: true,
        type: Number,
        trim: true,
        default: Date.now()
    },
})

export default model('students',studentSchema);