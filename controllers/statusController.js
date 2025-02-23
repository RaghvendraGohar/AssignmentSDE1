import Request from '../models/Request.js';

export const getStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const requestRecord = await Request.findOne({ requestId });

    if (!requestRecord) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.status(200).json({
      requestId: requestRecord.requestId,
      status: requestRecord.status,
      products: requestRecord.products,
      createdAt: requestRecord.createdAt,
      updatedAt: requestRecord.updatedAt
    });
  } catch (error) {
    console.error('Status Error:', error);
    res.status(500).json({ error: 'Failed to retrieve status' });
  }
};
