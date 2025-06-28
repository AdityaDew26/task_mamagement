// controllers/teamController.js
import Team from '../model/teamMember.js';
import User from '../model/User.js';

/**
 * Create a new team
 */
export const createTeam = async (req, res) => {
  try {
    const { name, members } = req.body;

    // Validate input
    if (!name || !Array.isArray(members)) {
      return res.status(400).json({ error: 'Team name and members are required' });
    }

    // Validate user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }

    // Create team
    const team = new Team({
      name,
      members,
      createdBy: req.user.id
    });

    await team.save();

    // Proper population after saving (fixing the original error)
    await team.populate([
      { path: 'members', select: 'name email' },
      { path: 'createdBy', select: 'name' }
    ]);

    // Send response
    res.status(201).json(team);
  } catch (err) {
    console.error('❌ Error creating team:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to create team', details: err.message });
  }
};

/**
 * Get all teams
 */
export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('members', 'name email')
      .populate('createdBy', 'name');

    res.json(teams);
  } catch (error) {
    console.error('❌ Error fetching teams:', error.message);
    res.status(500).json({ message: 'Error fetching teams' });
  }
};

/**
 * Get a specific team by ID
 */
export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('members', 'name email')
      .populate('createdBy', 'name');

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.status(200).json(team);
  } catch (err) {
    console.error('❌ Error fetching team by ID:', err.message);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
};

/**
 * Add a member to a team
 */
export const addMemberToTeam = async (req, res) => {
  try {
    const { userId } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) return res.status(404).json({ error: 'Team not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!team.members.includes(userId)) {
      team.members.push(userId);
      await team.save();
    }

    const updatedTeam = await Team.findById(req.params.id)
      .populate('members', 'name email')
      .populate('createdBy', 'name');

    res.status(200).json(updatedTeam);
  } catch (err) {
    console.error('❌ Error adding member:', err.message);
    res.status(500).json({ error: 'Failed to add member' });
  }
};

/**
 * Update a team
 */
export const updateTeam = async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name || !Array.isArray(members)) {
      return res.status(400).json({ error: 'Name and members array are required' });
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      { name, members },
      { new: true, runValidators: true }
    ).populate('members', 'name email')
     .populate('createdBy', 'name');

    if (!updatedTeam) return res.status(404).json({ error: 'Team not found' });

    res.status(200).json(updatedTeam);
  } catch (error) {
    console.error('❌ Error updating team:', error.message);
    res.status(500).json({ message: 'Server error while updating team', error: error.message });
  }
};

/**
 * Delete a team
 */
export const deleteTeam = async (req, res) => {
  try {
    const deletedTeam = await Team.findByIdAndDelete(req.params.id);

    if (!deletedTeam) return res.status(404).json({ error: 'Team not found' });

    res.status(200).json({ message: 'Team deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting team:', err.message);
    res.status(500).json({ error: 'Failed to delete team' });
  }
};
