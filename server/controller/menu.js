import Menu from "../model/menu-schema.js";

//////////////////////////////////////////////////////  MENU  //////////////////////////////////////////////////////

// export async function createMenu(req, res) {
//     try {
//         const { day, items } = req.body;
//         await Menu.create({day, items});
//         res.json({ status: "success" });
//     } catch (error) {
//         res.json({ status: "failed", message: "Network error" });
//     }
// }

export async function listMenu(req, res) {
    try {
        const hostel_id = req.hostelId ? req.hostelId : req.query.hostel_id
        const menus = await Menu.find({ hostel_id: hostel_id }).sort({ created_at: -1 })
        res.json({ status: "success", menus })
    } catch (error) {
        res.json({ status: "failed", message: "Network error" })
    }
}

export async function updateMenu(req, res) {
    try {
        console.log(req.body);
        
        const menu = await Menu.findById(req.body._id)
        if (menu) {
            await Menu.updateOne({ _id: req.body._id }, {
                $set: {
                    items: req.body.items ? req.body.items : menu.items
                }
            })
            res.json({ status: "success" })
        } else {
            res.json({ status: "failed", message: "This menu not exist" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Network error" })
    }
}