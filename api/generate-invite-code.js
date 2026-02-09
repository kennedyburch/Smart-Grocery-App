// Generate new invite code for household
import { db } from './db.js';

// Middleware to verify user authentication
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

// Generate unique invite code
const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const auth = verifyAuth(req);
    const userId = auth.userId;
    const { householdId } = req.body;

    if (!householdId) {
      return res.status(400).json({
        success: false,
        error: 'Household ID is required'
      });
    }

    // Verify user is owner or admin of the household
    const userMembership = db.householdMembers.findByUserAndHousehold(userId, householdId);
    if (!userMembership || (userMembership.role !== 'owner' && userMembership.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to generate invite codes for this household'
      });
    }

    // Generate new invite code and update household
    let newInviteCode;
    let attempts = 0;
    
    // Ensure invite code is unique (rare collision check)
    do {
      newInviteCode = generateInviteCode();
      attempts++;
    } while (db.households.findByInviteCode(newInviteCode) && attempts < 10);

    if (attempts >= 10) {
      return res.status(500).json({
        success: false,
        error: 'Unable to generate unique invite code. Please try again.'
      });
    }

    const updatedHousehold = db.households.update(householdId, {
      inviteCode: newInviteCode
    });

    if (!updatedHousehold) {
      return res.status(404).json({
        success: false,
        error: 'Household not found'
      });
    }

    return res.status(200).json({
      success: true,
      inviteCode: newInviteCode,
      household: updatedHousehold
    });

  } catch (error) {
    console.error('Generate invite code API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
