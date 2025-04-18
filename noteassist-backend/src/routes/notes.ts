import express, { Request, Response } from 'express';
import { db } from '../config/firebase';

const router = express.Router();

// Get all notes for a user with filtering and sorting
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    const { 
      search, 
      category, 
      sortBy = 'updatedAt', 
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    let query = db.collection('notes').where('userId', '==', userId);

    // Apply category filter if provided
    if (category) {
      query = query.where('category', '==', category);
    }

    // Apply search if provided
    if (search) {
      query = query.where('searchableText', '>=', search)
                  .where('searchableText', '<=', search + '\uf8ff');
    }

    // Apply sorting
    query = query.orderBy(sortBy as string, sortOrder as 'asc' | 'desc');

    // Get total count for pagination
    const snapshot = await query.get();
    const total = snapshot.size;

    // Apply pagination
    const startAt = (Number(page) - 1) * Number(limit);
    query = query.limit(Number(limit)).offset(startAt);

    const notesSnapshot = await query.get();
    const notes = notesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      notes,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Notes fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch notes',
      details: error.message
    });
  }
});

// Create a new note
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    const { title, content, category, tags } = req.body;

    // Create searchable text for better search functionality
    const searchableText = `${title} ${content} ${tags?.join(' ') || ''}`.toLowerCase();

    const newNote = {
      userId,
      title,
      content,
      category,
      tags: tags || [],
      searchableText,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('notes').add(newNote);

    res.status(201).json({
      id: docRef.id,
      ...newNote
    });
  } catch (error: any) {
    console.error('Note creation error:', error);
    res.status(500).json({
      error: 'Failed to create note',
      details: error.message
    });
  }
});

// Update a note
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    const noteId = req.params.id;
    const { title, content, category, tags } = req.body;

    // Get the note to verify ownership
    const noteRef = db.collection('notes').doc(noteId);
    const note = await noteRef.get();

    if (!note.exists) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (note.data()?.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this note' });
    }

    // Create searchable text for better search functionality
    const searchableText = `${title} ${content} ${tags?.join(' ') || ''}`.toLowerCase();

    const updateData = {
      title,
      content,
      category,
      tags: tags || [],
      searchableText,
      updatedAt: new Date().toISOString()
    };

    await noteRef.update(updateData);

    res.json({
      id: noteId,
      ...updateData
    });
  } catch (error: any) {
    console.error('Note update error:', error);
    res.status(500).json({
      error: 'Failed to update note',
      details: error.message
    });
  }
});

// Delete a note
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    const noteId = req.params.id;

    // Get the note to verify ownership
    const noteRef = db.collection('notes').doc(noteId);
    const note = await noteRef.get();

    if (!note.exists) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (note.data()?.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this note' });
    }

    await noteRef.delete();

    res.json({
      message: 'Note deleted successfully',
      id: noteId
    });
  } catch (error: any) {
    console.error('Note deletion error:', error);
    res.status(500).json({
      error: 'Failed to delete note',
      details: error.message
    });
  }
});

// Get note categories
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    
    const notesSnapshot = await db.collection('notes')
      .where('userId', '==', userId)
      .get();

    const categories = new Set<string>();
    notesSnapshot.docs.forEach(doc => {
      const category = doc.data().category;
      if (category) {
        categories.add(category);
      }
    });

    res.json({
      categories: Array.from(categories)
    });
  } catch (error: any) {
    console.error('Categories fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch categories',
      details: error.message
    });
  }
});

export default router; 