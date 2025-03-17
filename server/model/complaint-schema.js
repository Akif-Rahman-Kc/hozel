import { Schema, model } from 'mongoose';

const complaintSchema = new Schema({
    hostel_id:{
        type:String,
        required:true,
        trim:true
    },
    student_name:{
        type:String,
        required:true,
        trim:true
    },
    room_no:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required: true,
        trim: true
    },
    status:{
        type: String,
        required: true,
        trim: true,
        default: "PENDING"
    },
    created_at:{
        required: true,
        type: Number,
        trim: true,
        default: Date.now()
    }
})

export default model('complaints',complaintSchema);