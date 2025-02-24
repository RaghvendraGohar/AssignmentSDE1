// workers/imageWorker.js
import sharp from 'sharp';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import Request from '../models/Request.js';

export const processImages = async (request) => {
  try {
    // Update request status to "processing"
    request.status = 'processing';
    await request.save();

    for (const product of request.products) {
      const outputUrls = [];
      for (const url of product.inputImageUrls) {
        const processedImageUrl = await compressAndStoreImage(url);
        outputUrls.push(processedImageUrl);
      }
      product.outputImageUrls = outputUrls;
    }

    // Update request status to "completed"
    request.status = 'completed';
    request.updatedAt = new Date();
    await request.save();

    // Optionally: Trigger a webhook callback to notify external systems here
    // await triggerWebhook(request);
  } catch (error) {
    console.error('Error in processImages:', error);
  }
};

const serverUrl = 'https://assignmentsde1.onrender.com'; // Change this to your actual domain

async function compressAndStoreImage(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    const processedBuffer = await sharp(imageBuffer)
      .jpeg({ quality: 50 })
      .toBuffer();

    const processedFolder = 'processed';
    if (!fs.existsSync(processedFolder)) {
      fs.mkdirSync(processedFolder);
    }

    const filename = `${Date.now()}-${Math.round(Math.random() * 1000)}.jpg`;
    const filepath = path.join(processedFolder, filename);

    fs.writeFileSync(filepath, processedBuffer);

    // Return a URL based on your hosted server
    return `${serverUrl}/processed/${filename}`;
  } catch (error) {
    console.error('Error in compressAndStoreImage:', error);
    return imageUrl;
  }
}

