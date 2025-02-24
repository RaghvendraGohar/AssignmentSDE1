SDE Assignment Backend - Comprehensive Documentation -
This document provides full details about the SDE Assignment Backend project, including API specifications, asynchronous worker functions, repository structure with code snippets, and a public Postman collection link for testing the APIs.

Table of Contents
Overview
API Documentation
Upload API
Status API
Webhook API
Asynchronous Worker Documentation
Repository Structure and Code
Environment Setup (.env)
.gitignore
Postman Collection
Running the Application
License

Overview
This project implements a backend system using Node.js, MongoDB, and ES6 modules for processing product images uploaded via a CSV file. It provides:
CSV File Upload: API for uploading a CSV file containing product details and image URLs.
Asynchronous Image Processing: Downloads and compresses images (reducing quality by 50%) using the Sharp library.
Status Tracking: API to check processing status and retrieve processed image URLs.
Webhook Endpoint: Receives callbacks for updating processed data.

API Documentation
Base URL
https://assignmentsde1.onrender.com

Upload API
Method: POST
Endpoint: /upload
Description: Upload a CSV file containing product data and image URLs. The CSV must include the following headers:
S. No.
Product Name
Input Image Urls
Headers:
 Content-Type: multipart/form-data
Request Body:
 Upload the CSV file in form-data with the key file.
Success Response (HTTP 200):
 {
  "requestId": "unique-uuid-string"
}


Error Response: Returns an error message if the file is missing or if there is a server error.

Status API
Method: GET
Endpoint: /status/:requestId
Description: Retrieve the processing status and product details (including processed image URLs) for the given requestId.
Path Parameter:
requestId: The unique ID obtained from the Upload API.
Success Response (HTTP 200):
 {
  "requestId": "unique-uuid-string",
  "status": "pending | processing | completed",
  "products": [
    {
      "serialNumber": 1,
      "productName": "SKU1",
      "inputImageUrls": [
       "https://example.com/image1.jpg",
        "https://example.com/image2.jpg"
      ],
      "outputImageUrls": [
        "processed/1614701234567-123.jpg",
        "processed/1614701234568-456.jpg"
      ]
    }
  ],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}


Error Response:
404 Not Found if the requestId does not exist.
500 Internal Server Error for server issues.

Webhook API
Method: POST
Endpoint: /webhook
Description: Receives callbacks from the asynchronous image processing service. This endpoint updates the request record with processed image URLs and changes the status to "completed".
Headers:
Content-Type: application/json
Request Body Example:
 {
  "requestId": "unique-uuid-string",
  "products": [
    {
      "serialNumber": 1,
      "productName": "SKU1",
      "inputImageUrls": [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg"
      ],
      "outputImageUrls": [
        "processed/1614701234567-123.jpg",
        "processed/1614701234568-456.jpg"
      ]
    }
  ],
  "status": "completed"
}


Success Response (HTTP 200):
 {
  "message": "Webhook processed successfully"
}


Error Response:
400 Bad Request if required fields are missing.
404 Not Found if the record is not found.
500 Internal Server Error for server issues.

Asynchronous Worker Documentation
Asynchronous Image Processing Worker
File: workers/imageWorker.js
Function: processImages
Purpose:
Image Processing:
Downloads images from inputImageUrls.
Compresses them using the Sharp library (reducing quality by 50%).
Saves processed images locally in the processed/ folder.
Workflow:
Status Update: Change request status from pending to processing.
Process Images:
Loop through each product and process each inputImageUrl.
Download and compress images.
Save processed images locally.
Finalize Request:
Update outputImageUrls.
Change request status to completed.
Webhook Callback (Optional):
Notify an external webhook about completion.

