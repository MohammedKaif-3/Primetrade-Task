import taskModel from "../models/taskModel.js";

export const createTask = async (req, res) => {

    try {

        const { userId, title, description, status } = req.body;

        if (!userId) return res.json({ success: false, message: "Auth failed: userId missing" });

        const task = await taskModel.create({
            userId,
            title,
            description,
            status
        });


        res.json({ success: true, task });
    } catch (err) {
        console.log("❌ ERROR:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};


export const getTasks = async (req, res) => {
    try {
        const {userId} = req.body;

        const tasks = await taskModel.find({ userId }).sort({ createdAt: -1 });

        res.json({ success: true, tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const {userId} = req.body;

        const updated = await taskModel.findOneAndUpdate(
            { _id: id, userId },
            { $set: req.body },
            { new: true }
        );

        res.json({ success: true, task: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const {userId} = req.body;

        await taskModel.deleteOne({ _id: id, userId });

        res.json({ success: true, message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
