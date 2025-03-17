import { Schema, model } from 'mongoose';

const menuSchema = new Schema({
    hostel_id:{
        type: String,
        required: true,
        trim: true
    },
    day:{
        type: String,
        required: true,
        trim: true
    },
    items:[{
        type:{
            type:String,
            required: true,
            trim: true
        },
        dishes:{
            type:String,
            trim: true
        }
    }],
    created_at:{
        required: true,
        type: Number,
        trim: true,
        default: Date.now()
    },
})

export default model('menus',menuSchema);