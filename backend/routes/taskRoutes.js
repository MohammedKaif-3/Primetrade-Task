import express from "express";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/taskController.js";
import userAuth from "../middleware/userAuth.js";

const taskRouter = express.Router();

taskRouter.post("/create", userAuth, createTask);
taskRouter.get("/all", userAuth, getTasks);
taskRouter.put("/update/:id", userAuth, updateTask);
taskRouter.delete("/delete/:id", userAuth, deleteTask);

export default taskRouter;
