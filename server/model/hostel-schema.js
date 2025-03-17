import { Schema, model } from 'mongoose';

const hostelSchema = new Schema({
    warden_name:{
        type:String,
        required:true,
        trim:true
    },
    address:{
        type: String,
        required: true,
        trim: true
    },
    hostel_name:{
        type:String,
        required:true,
        trim:true
    },
    college_name:{
        type: String,
        required: true,
        trim: true
    },
    warden_mobile_no:{
        type: String,
        required: true,
        trim: true
    },
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    created_at:{
        required: true,
        type: Number,
        trim: true,
        default: Date.now()
    },
})

export default model('hostels',hostelSchema);