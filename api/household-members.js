// Household member management API endpoints  
import { db } from './db.js';// Middleware to verify user authentication
function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error('No authorization header');
  }
  
  const token = authHeader.replace('Bearer ', '');
  if (!token || token.length < 10) {
    throw new Error('Invalid token');
  }
  
  return { userId: token }; // Simplified for demo
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const auth = verifyAuth(req);
    const userId = auth.userId;
    const { householdId } = req.query;

    if (!householdId) {
      return res.status(400).json({
        success: false,
        error: 'Household ID is required'
      });
    }

    // Verify user is member of the household
    const userMembership = db.householdMembers.findByUserAndHousehold(userId, householdId);
    if (!userMembership) {
      return res.status(403).json({
        success: false,
        error: 'You are not a member of this household'
      });
    }

    switch (req.method) {
      case 'GET':
        // Get household members
        const members = db.householdMembers.findByHouseholdId(householdId);
        const membersWithUsers = members.map(member => {
          const user = db.users.findById(member.userId);
          return {
            ...member,
            user: user ? { 
              id: user.id, 
              email: user.email, 
              name: user.name 
            } : null
          };
        });

        return res.status(200).json({
          success: true,
          members: membersWithUsers
        });

      case 'PUT':
        // Update member role (admin/owner only)
        const { targetUserId, newRole } = req.body;

        if (!targetUserId || !newRole) {
          return res.status(400).json({
            success: false,
            error: 'Target user ID and new role are required'
          });
        }

        // Verify current user has permission to change roles
        if (userMembership.role !== 'owner' && userMembership.role !== 'admin') {
          return res.status(403).json({
            success: false,
            error: 'You do not have permission to change member roles'
          });
        }

        // Verify target user exists in household
        const targetMembership = db.householdMembers.findByUserAndHousehold(targetUserId, householdId);
        if (!targetMembership) {
          return res.status(404).json({
            success: false,
            error: 'Target user is not a member of this household'
          });
        }

        // Prevent non-owners from changing owner role
        if (newRole === 'owner' && userMembership.role !== 'owner') {
          return res.status(403).json({
            success: false,
            error: 'Only owners can assign owner role'
          });
        }

        // Prevent changing your own role as owner
        if (targetUserId === userId && userMembership.role === 'owner') {
          return res.status(400).json({
            success: false,
            error: 'Owners cannot change their own role'
          });
        }

        const updatedMember = db.householdMembers.updateRole(targetUserId, householdId, newRole);

        return res.status(200).json({
          success: true,
          member: updatedMember
        });

      case 'DELETE':
        // Remove member from household (admin/owner only, or self-removal)
        const { removeUserId } = req.body;

        if (!removeUserId) {
          return res.status(400).json({
            success: false,
            error: 'User ID to remove is required'
          });
        }

        // Check if user can remove members (is admin/owner or removing themselves)
        const canRemove = 
          userMembership.role === 'owner' || 
          userMembership.role === 'admin' || 
          removeUserId === userId;

        if (!canRemove) {
          return res.status(403).json({
            success: false,
            error: 'You do not have permission to remove this member'
          });
        }

        // Verify target user exists in household
        const targetMember = db.householdMembers.findByUserAndHousehold(removeUserId, householdId);
        if (!targetMember) {
          return res.status(404).json({
            success: false,
            error: 'User is not a member of this household'
          });
        }

        // Prevent removing owner (owner must transfer ownership first)
        if (targetMember.role === 'owner' && removeUserId !== userId) {
          return res.status(400).json({
            success: false,
            error: 'Cannot remove owner. Transfer ownership first.'
          });
        }

        // If owner is removing themselves, check for other members
        if (targetMember.role === 'owner' && removeUserId === userId) {
          const allMembers = db.householdMembers.findByHouseholdId(householdId);
          if (allMembers.length > 1) {
            return res.status(400).json({
              success: false,
              error: 'Cannot leave household as owner. Transfer ownership or delete household first.'
            });
          }
        }

        const removedMember = db.householdMembers.remove(removeUserId, householdId);

        return res.status(200).json({
          success: true,
          message: 'Member removed successfully',
          removedMember
        });

      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('Household members API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
