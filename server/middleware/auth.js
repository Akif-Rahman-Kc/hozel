import pkg from 'jsonwebtoken';
const { verify } = pkg;

///////////////////////////////////////////////// STUDENT /////////////////////////////////////////////////

export async function studentJWT(req, res, next) {
    const token = req.headers['studenttoken'];
    if (!token) {
        res.json({auth:false, status:"failed", message:"Please logout and try"})
    } else {
        verify(token,process.env.JWT_SECRET_KEY,(err,decoded)=>{
            if (err) {
                console.log(err);
                res.json({auth:false, status:"failed", message:"Please logout and try"})
            } else {
                req.studentId = decoded.studentId
                next();
            }
        })
    }
}

///////////////////////////////////////////////// HOSTEL /////////////////////////////////////////////////

export async function hostelJWT(req, res, next) {
    const token = req.headers['hosteltoken'];
    if (!token) {
        res.json({auth:false, status:"failed", message:"Please logout and try"})
    } else {
        verify(token,process.env.JWT_SECRET_KEY,(err,decoded)=>{
            if (err) {
                console.log(err);
                res.json({auth:false, status:"failed", message:"Please logout and try"})
            } else {
                req.hostelId = decoded.hostelId
                next();
            }
        })
    }
}

///////////////////////////////////////////////// PARENT /////////////////////////////////////////////////

export async function parentJWT(req, res, next) {
    const token = req.headers['parenttoken'];
    if (!token) {
        res.json({auth:false, status:"failed", message:"Please logout and try"})
    } else {
        verify(token,process.env.JWT_SECRET_KEY,(err,decoded)=>{
            if (err) {
                console.log(err);
                res.json({auth:false, status:"failed", message:"Please logout and try"})
            } else {
                req.parentId = decoded.parentId
                next();
            }
        })
    }
}