// controllers/webhookController.js
import Request from '../models/Request.js';

export const webhookHandler = async (req, res) => {
  try {
    // Expected payload: { requestId, products, status }
    const { requestId, products, status } = req.body;
    
    if (!requestId || !products || !status) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }
    
    // Update the request record in MongoDB
    const requestRecord = await Request.findOneAndUpdate(
      { requestId },
      { products, status, updatedAt: new Date() },
      { new: true }
    );
    
    if (!requestRecord) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
};
