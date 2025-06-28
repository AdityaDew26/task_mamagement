import User from '../model/User.js';

export const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

export const updateUser = async (req, res) => {
  const { name, role } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { name, role }, { new: true });
  res.json(user);
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};

export const toggleUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id);
  user.active = !user.active;
  await user.save();
  res.json(user);
};
