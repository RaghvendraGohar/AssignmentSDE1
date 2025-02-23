import { v4 as uuidv4 } from 'uuid';
import csvParser from '../utils/csvParser.js';
import Request from '../models/Request.js';
import { processImages } from '../workers/imageWorker.js';

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'CSV file is required' });
    }

    const products = await csvParser(req.file.path);

    const requestId = uuidv4();

    const newRequest = new Request({
      requestId,
      status: 'pending',
      products,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newRequest.save();

    processImages(newRequest).catch(error => {
      console.error('Error processing images:', error);
    });

    res.status(200).json({ requestId });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to process CSV file' });
  }
};
