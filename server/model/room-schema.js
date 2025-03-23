import { Schema, model } from 'mongoose';

const roomSchema = new Schema({
    hostel_id:{
        type:String,
        required:true,
        trim:true
    },
    room_no:{
        type:String,
        required:true,
        trim:true
    },
    room_type:{
        type:String,
        required:true,
        trim:true
    },
    capacity:{
        type:Number,
        required:true,
        trim:true
    },
    occupants:[{
        student_id:{
            type:String,
            required: true,
            trim: true
        },
        student_name:{
            type:String,
            required: true,
            trim: true
        },
        department:{
            type:String,
            required: true,
            trim: true
        }
    }],
    facilities:{
        type:Array,
        required: true,
        trim: true
    },
    price:{
        type: Number,
        required: true,
        trim: true
    },
    availability:{
        type: Number,
        required: true,
        trim: true
    },
    image:{
        type: Object,
        required: true,
        trim: true
    },
    status:{
        type: String,
        required: true,
        trim: true,
        default: "OPEN"
    },
    created_at:{
        required: true,
        type: Number,
        trim: true,
        default: Date.now()
    }
})

export default model('rooms',roomSchema);