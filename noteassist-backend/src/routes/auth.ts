import express, { Request, Response } from 'express';
import { auth, db } from '../config/firebase';
import { UserRecord } from 'firebase-admin/auth';

const router = express.Router();

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, displayName } = req.body;

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
    });

    // Create user profile in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      displayName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    res.status(201).json({
      message: 'User created successfully',
      uid: userRecord.uid,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Failed to create user',
      details: error.message,
    });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json({
      user: {
        uid: decodedToken.uid,
        ...userDoc.data(),
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(401).json({
      error: 'Authentication failed',
      details: error.message,
    });
  }
});

// Get user profile
router.get('/profile/:uid', async (req: Request, res: Response) => {
  try {
    const userDoc = await db.collection('users').doc(req.params.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      uid: req.params.uid,
      ...userDoc.data(),
    });
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch user profile',
      details: error.message,
    });
  }
});

// Update user profile
router.put('/profile/:uid', async (req: Request, res: Response) => {
  try {
    const { displayName, email } = req.body;
    const uid = req.params.uid;

    // Update user in Firebase Auth
    await auth.updateUser(uid, {
      displayName,
      email,
    });

    // Update user in Firestore
    await db.collection('users').doc(uid).update({
      displayName,
      email,
      updatedAt: new Date().toISOString(),
    });

    res.json({
      message: 'Profile updated successfully',
      uid,
    });
  } catch (error: any) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      details: error.message,
    });
  }
});

// Delete user account
router.delete('/profile/:uid', async (req: Request, res: Response) => {
  try {
    const uid = req.params.uid;

    // Delete user from Firebase Auth
    await auth.deleteUser(uid);

    // Delete user data from Firestore
    await db.collection('users').doc(uid).delete();

    // Delete user's notes
    const notesSnapshot = await db.collection('notes')
      .where('userId', '==', uid)
      .get();
    
    const batch = db.batch();
    notesSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    res.json({
      message: 'User account deleted successfully',
      uid,
    });
  } catch (error: any) {
    console.error('Account deletion error:', error);
    res.status(500).json({
      error: 'Failed to delete account',
      details: error.message,
    });
  }
});

export default router; 