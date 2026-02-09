// Household management API endpoints
import { db } from './db.js';

// Middleware to verify user authentication
function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error('No authorization header');
  }
  
  const token = authHeader.replace('Bearer ', '');
  // In a real app, verify JWT token here
  // For demo, we'll extract user ID from a simple format
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

    switch (req.method) {
      case 'GET':
        // Get user's households
        const userHouseholds = db.householdMembers.getUserHouseholdsWithDetails(userId);
        return res.status(200).json({
          success: true,
          households: userHouseholds
        });

      case 'POST':
        if (req.url?.includes('/join')) {
          // Join household via invite code
          const { inviteCode } = req.body;
          
          if (!inviteCode) {
            return res.status(400).json({
              success: false,
              error: 'Invite code is required'
            });
          }

          const household = db.households.findByInviteCode(inviteCode);
          if (!household) {
            return res.status(404).json({
              success: false,
              error: 'Invalid invite code'
            });
          }

          // Check if user is already a member
          const existingMember = db.householdMembers.findByUserAndHousehold(userId, household.id);
          if (existingMember) {
            return res.status(400).json({
              success: false,
              error: 'You are already a member of this household'
            });
          }

          // Add user to household
          const newMember = db.householdMembers.create({
            userId,
            householdId: household.id,
            role: 'member' // Default role
          });

          return res.status(200).json({
            success: true,
            household,
            member: newMember
          });
        } else {
          // Create new household
          const { name, description } = req.body;
          
          if (!name) {
            return res.status(400).json({
              success: false,
              error: 'Household name is required'
            });
          }

          // Create household
          const newHousehold = db.households.create({
            name: name.trim(),
            description: description?.trim() || '',
            ownerId: userId
          });

          // Add creator as owner
          const ownerMember = db.householdMembers.create({
            userId,
            householdId: newHousehold.id,
            role: 'owner'
          });

          return res.status(201).json({
            success: true,
            household: newHousehold,
            member: ownerMember
          });
        }

      case 'PUT':
        // Update household
        const householdId = req.url?.split('/')[2]; // Extract from /api/households/{id}
        const { name, description } = req.body;

        if (!householdId) {
          return res.status(400).json({
            success: false,
            error: 'Household ID is required'
          });
        }

        // Verify user is owner or admin
        const member = db.householdMembers.findByUserAndHousehold(userId, householdId);
        if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
          return res.status(403).json({
            success: false,
            error: 'You do not have permission to update this household'
          });
        }

        const updatedHousehold = db.households.update(householdId, {
          name: name?.trim(),
          description: description?.trim()
        });

        if (!updatedHousehold) {
          return res.status(404).json({
            success: false,
            error: 'Household not found'
          });
        }

        return res.status(200).json({
          success: true,
          household: updatedHousehold
        });

      case 'DELETE':
        // Leave or delete household
        const deleteHouseholdId = req.url?.split('/')[2];
        
        if (!deleteHouseholdId) {
          return res.status(400).json({
            success: false,
            error: 'Household ID is required'
          });
        }

        const memberToRemove = db.householdMembers.findByUserAndHousehold(userId, deleteHouseholdId);
        if (!memberToRemove) {
          return res.status(404).json({
            success: false,
            error: 'You are not a member of this household'
          });
        }

        if (memberToRemove.role === 'owner') {
          // Check if there are other members
          const allMembers = db.householdMembers.findByHouseholdId(deleteHouseholdId);
          if (allMembers.length > 1) {
            return res.status(400).json({
              success: false,
              error: 'Cannot delete household with other members. Transfer ownership or remove all members first.'
            });
          }
          
          // Delete entire household if owner and no other members
          db.households.delete(deleteHouseholdId);
        } else {
          // Just remove user from household
          db.householdMembers.remove(userId, deleteHouseholdId);
        }

        return res.status(200).json({
          success: true,
          message: memberToRemove.role === 'owner' ? 'Household deleted' : 'Left household successfully'
        });

      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('Household API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
