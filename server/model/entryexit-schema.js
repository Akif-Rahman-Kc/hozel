import { Schema, model } from 'mongoose';

const entryexistSchema = new Schema({
    hostel_id:{
        type:String,
        required:true,
        trim:true
    },
    student_id:{
        type:String,
        required:true,
        trim:true
    },
    exit_time:{
        type: Number,
        required: true,
        default: 0
    },
    entry_time:{
        type: Number,
        trim: true,
        default: 0
    },
    status:{
        required: true,
        type: String,
        trim: true,
        default: "INSIDE"
    },
    created_at:{
        required: true,
        type: Number,
        trim: true,
        default: Date.now()
    },
})

export default model('entryexists',entryexistSchema);