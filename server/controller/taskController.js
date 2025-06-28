// controllers/taskController.js
import Task from '../model/Task.js';

export const createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task.' });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate({
      path: 'team',
      populate: { path: 'members', select: 'name' }
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
};

export const getTaskStats = async (req, res) => {
  try {
    const tasks = await Task.find();
    const stats = {
      upcoming: tasks.filter(t => t.status === 'Upcoming').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      completed: tasks.filter(t => t.status === 'Completed').length,
    };
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to compute stats.' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true }).populate('team');
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update task.' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task.' });
  }
};
