import { Schema, model } from 'mongoose';

const parentSchema = new Schema({
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