import { Schema, model } from 'mongoose';

const checkinSchema = new Schema({
    student_id:{
        type:String,
        required:true,
        trim:true
    },
    student_name:{
        type:String,
        required:true,
        trim:true
    },
    mobile_no:{
        type:String,
        required:true,
        trim:true
    },
    date:{
        type: Number,
        required: true,
        trim: true
    },
    checkin_time:{
        type: Number,
        trim: true
    },
    status:{
        required: true,
        type: String,
        trim: true,
        default: "Present"
    },
    created_at:{
        required: true,
        type: Number,
        trim: true,
        default: Date.now()
    },
})

export default model('checkins',checkinSchema);