# SDE Assignment Backend - README

## Overview
This project implements a backend system using **Node.js, MongoDB, and ES6 modules** for processing product images uploaded via a CSV file. It provides:

- **CSV File Upload:** API for uploading a CSV file containing product details and image URLs.
- **Asynchronous Image Processing:** Downloads and compresses images (reducing quality by 50%) using the Sharp library.
- **Status Tracking:** API to check processing status and retrieve processed image URLs.
- **Webhook Endpoint:** Receives callbacks for updating processed data.

---

## Table of Contents

1. [API Documentation](#api-documentation)
   - [Upload API](#upload-api)
   - [Status API](#status-api)
   - [Webhook API](#webhook-api)
2. [Asynchronous Worker](#asynchronous-worker)
3. [Repository Structure](#repository-structure)
4. [Setup and Installation](#setup-and-installation)
5. [Running the Application](#running-the-application)
6. [Environment Variables](#environment-variables)
7. [License](#license)

---

## API Documentation

### Base URL
```
https://assignmentsde1.onrender.com
```

### Upload API
- **Method:** `POST`
- **Endpoint:** `/upload`
- **Description:** Upload a CSV file containing product data and image URLs. The CSV must include:
  - `S. No.`
  - `Product Name`
  - `Input Image Urls`
- **Headers:** `Content-Type: multipart/form-data`
- **Request Body:** Upload the CSV file in form-data with the key `file`.
- **Response:**
```json
{
  "requestId": "unique-uuid-string"
}
```

### Status API
- **Method:** `GET`
- **Endpoint:** `/status/:requestId`
- **Description:** Retrieve the processing status and product details (including processed image URLs) for the given `requestId`.
- **Response:**
```json
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
  ]
}
```

### Webhook API
- **Method:** `POST`
- **Endpoint:** `/webhook`
- **Description:** Receives callbacks from the asynchronous image processing service.
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "requestId": "unique-uuid-string",
  "products": [...],
  "status": "completed"
}
```

---

## Asynchronous Worker

### Image Processing Worker
- **File:** `workers/imageWorker.js`
- **Function:** `processImages`
- **Purpose:**
  - Downloads images from `inputImageUrls`.
  - Compresses them using **Sharp** (reducing quality by 50%).
  - Saves processed images in `processed/` folder.
- **Workflow:**
  1. Change request status from `pending` to `processing`.
  2. Process each `inputImageUrl`.
  3. Update `outputImageUrls`.
  4. Change request status to `completed`.
  5. Optionally notify a webhook.

---

## Repository Structure
```
📂 SDE-Backend
 ┣ 📂 workers
 ┃ ┗ 📜 imageWorker.js
 ┣ 📜 server.js
 ┣ 📜 package.json
 ┣ 📜 .gitignore
 ┗ 📜 README.md
```

---

## Setup and Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/SDE-Backend.git
   cd SDE-Backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables in `.env` file.
4. Start the application:
   ```sh
   npm start
   ```

---

## Environment Variables
Create a `.env` file and define:
```
MONGO_URI=mongodb+srv://...
PORT=3000
```

---

## Running the Application
To run the backend server:
```sh
npm run dev
```

---


