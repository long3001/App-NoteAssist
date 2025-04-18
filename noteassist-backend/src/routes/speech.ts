import express, { Request, Response } from 'express';
import { Storage } from '@google-cloud/storage';
import { SpeechClient } from '@google-cloud/speech';
import multer from 'multer';
import path from 'path';
import { db } from '../config/firebase';

const router = express.Router();
const speech = new SpeechClient();

// Configure multer for handling audio file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/webm'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only WAV, MP3, and WebM audio files are allowed.'));
    }
  },
});

interface TranscriptionResult {
  transcript: string;
  confidence: number;
}

// Endpoint to handle audio file upload and transcription
router.post('/transcribe', upload.single('audio'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Configure the audio settings
    const audio = {
      content: req.file.buffer.toString('base64'),
    };
    
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    };
    
    const request = {
      audio: audio,
      config: config,
    };

    // Perform the transcription
    const [response] = await speech.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    // Create a new note with the transcription
    const newNote = {
      title: `Transcription ${new Date().toISOString()}`,
      content: transcription,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: 'transcription'
    };

    const docRef = await db.collection('notes').add(newNote);

    res.status(200).json({
      id: docRef.id,
      ...newNote,
      message: 'Audio transcribed successfully'
    });

  } catch (error: any) {
    console.error('Transcription error:', error);
    res.status(500).json({
      error: 'Failed to process audio file',
      details: error.message
    });
  }
});

// Get transcription status
router.get('/status/:id', async (req: Request, res: Response) => {
  try {
    const noteRef = db.collection('notes').doc(req.params.id);
    const note = await noteRef.get();
    
    if (!note.exists) {
      return res.status(404).json({ error: 'Transcription not found' });
    }

    res.json({
      id: note.id,
      ...note.data()
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to get transcription status',
      details: error.message
    });
  }
});

export default router; 