// routes/apiRoutes.js
import express from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/uploadController.js';
import { getStatus } from '../controllers/statusController.js';
import { webhookHandler } from '../controllers/webhookController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Upload CSV file endpoint
router.post('/upload', upload.single('file'), uploadFile);

// Status API to check processing status using requestId
router.get('/status/:requestId', getStatus);

// Webhook endpoint to receive callbacks from image processing service
router.post('/webhook', webhookHandler);

export default router;
