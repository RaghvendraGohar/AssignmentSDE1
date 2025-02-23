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

async function compressAndStoreImage(imageUrl) {
  try {
    // Download the image using axios
    const response = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'arraybuffer'
    });
    const imageBuffer = Buffer.from(response.data, 'binary');

    // Use sharp to compress the image (reduce quality by 50%)
    const processedBuffer = await sharp(imageBuffer)
      .jpeg({ quality: 50 })
      .toBuffer();

    // Ensure the "processed" folder exists
    const processedFolder = 'processed';
    if (!fs.existsSync(processedFolder)) {
      fs.mkdirSync(processedFolder);
    }
    // Generate a unique filename
    const filename = `${Date.now()}-${Math.round(Math.random() * 1000)}.jpg`;
    const filepath = path.join(processedFolder, filename);

    fs.writeFileSync(filepath, processedBuffer);

    // Return the local file path as the processed image URL
    return filepath;
  } catch (error) {
    console.error('Error in compressAndStoreImage:', error);
    return imageUrl; // Fallback: return the original URL if processing fails
  }
}
