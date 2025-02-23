// utils/csvParser.js
import fs from 'fs';
import csv from 'csv-parser';

const csvParser = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Assuming CSV headers: 'S. No.', 'Product Name', 'Input Image Urls'
        const product = {
          serialNumber: Number(data['S. No.']),
          productName: data['Product Name'],
          inputImageUrls: data['Input Image Urls'].split(',').map(url => url.trim()),
          outputImageUrls: []  // To be filled after processing
        };
        results.push(product);
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

export default csvParser;
