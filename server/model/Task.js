// models/Task.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['Upcoming', 'In Progress', 'Completed'], default: 'Upcoming' },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
export default Task;
