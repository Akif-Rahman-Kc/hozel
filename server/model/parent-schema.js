import { Schema, model } from 'mongoose';

const parentSchema = new Schema({
    hostel_id:{
        type:String,
        required:true,
        trim:true
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

export default model('parents',parentSchema);