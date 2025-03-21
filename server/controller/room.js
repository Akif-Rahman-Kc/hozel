import Room from "../model/room-schema.js";
import Student from "../model/student-schema.js";
import {v2 as cloudinary} from 'cloudinary';

//////////////////////////////////////////////////////  ROOM  //////////////////////////////////////////////////////

export async function createRoom(req, res) {
    try {
        const { room_no, room_type, capacity, facilities, price } = req.body;
        if (room_no != "" && room_type != "" && capacity != "" && facilities != "" && price != "") {
            if (req.file) {
                if (req.file.size < 10485760) {
                    cloudinary.config({
                        cloud_name: process.env.CLOUD_NAME,
                        api_key: process.env.CLOUD_KEY,
                        api_secret: process.env.CLOUD_SECRET,
                    });
                    const result = await cloudinary.uploader.upload(req.file.path);
                    const image = {
                        public_id: result.public_id,
                        path: result.secure_url,
                    };
                    await Room.create({hostel_id: req.hostelId, image, room_no, room_type, capacity, facilities: facilities.split(","), price, availability: capacity});
                    res.json({ status: "success" });
                } else {
                    res.json({
                        status: "failed",
                        message: "Image size is too heavy Pls select another Image",
                    });
                }
            } else {
                res.json({ status: "failed", message: "Please select a image" });
            }
        } else {
            res.json({
                status: "failed",
                message: "Please enter full details of room",
            });
        }
    } catch (error) {
        res.json({ status: "failed", message: "Network error" });
    }
}

export async function detailsRoom(req, res) {
    try {
        console.log(req.query, "==request");
        
        const room = await Room.findOne({ hostel_id: req.query.hostel_id, room_no: req.query.room_no })
        res.json({ status: "success", room })
    } catch (error) {
        res.json({ status: "failed", message: "Network error" })
    }
}

export async function listRoom(req, res) {
    try {
        const hostel_id = req.hostelId ? req.hostelId : req.query.hostel_id
        const rooms = await Room.find({hostel_id: hostel_id}).sort({ created_at: -1 })
        res.json({ status: "success", rooms })
    } catch (error) {
        res.json({ status: "failed", message: "Network error" })
    }
}

export async function updateRoom(req, res) {
    try {
        const room = await Room.findById(req.body._id)
        if (room) {
            let image = null
            if (req.file) {
                if (req.file.size < 10485760) {
                    cloudinary.config({
                        cloud_name: process.env.CLOUD_NAME,
                        api_key: process.env.CLOUD_KEY,
                        api_secret: process.env.CLOUD_SECRET
                    });
                    const result = await cloudinary.uploader.upload(req.file.path)
                    await cloudinary.api.delete_resources([room.image.public_id], { type: 'upload', resource_type: 'image' })
                    image = {
                        public_id:result.public_id,
                        path:result.secure_url
                    }
                } else {
                    res.json({status:"failed", message:"FIle size is too heavy Pls select another File"})
                }
            }
            await Room.updateOne({_id:req.body._id}, {
                $set:{
                    room_no: req.body.room_no ? req.body.room_no : room.room_no,
                    room_type: req.body.room_type ? req.body.room_type : room.room_type,
                    capacity: req.body.capacity ? req.body.capacity : room.capacity,
                    facilities: req.body.facilities ? req.body.facilities.split(",") : room.facilities,
                    price: req.body.price ? req.body.price : room.price,
                    image: image ? image : room.image,
                }
            })
            res.json({ status: "success" })
        } else {
            res.json({ status: "failed", message: "This room not exist" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Network error" })
    }
}

export async function updateRoomStatus(req, res) {
    try {
        const room = await Room.findById(req.body._id)
        if (room) {
            await Room.updateOne({ _id: req.body._id }, {
                $set: {
                    status: room.status === "OPEN" ? "CLOSE" : "OPEN"
                }
            })
            res.json({ status: "success" })
        } else {
            res.json({ status: "failed", message: "This room not exist" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Network error" })
    }
}

export async function deleteRoom(req, res) {
    try {
        const room = await Room.findById(req.query._id)
        if (room) {
            const student = await Student.findOne({ hostel_id: req.hostelId, room_no: room?.room_no })
            if (student) {
                res.json({ status: "failed", message: "This room already have students, you cant delete" })
            } else {
                cloudinary.config({
                    cloud_name: process.env.CLOUD_NAME, 
                    api_key: process.env.CLOUD_KEY, 
                    api_secret: process.env.CLOUD_SECRET
                });
                const result = await cloudinary.api.delete_resources([room.image.public_id], { type: 'upload', resource_type: 'image' })
                const deleted = Object.keys(result.deleted)[0]
                if (result.deleted[deleted] == 'deleted') {
                    await Room.deleteOne({ _id: req.query._id })
                    res.json({ status: "success" })
                }else{
                    res.json({status:"failed", message:"File not deleted"})
                }
            }
        } else {
            res.json({ status: "failed", message: "This room not exist" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Network error" })
    }
}