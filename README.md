# File Metadata Microservice
The file metadata API allows clients to upload files using the multipart/form-data format. The API extracts metadata from the uploaded file, such as the file name, MIME type, and size, and returns this information in JSON format.

## Installation
To use the file upload API, you need to have Node.js and npm (Node Package Manager) installed on your system.

1. Install dependencies

```sh
$ npm install
```

2. Start the API server by running the following command:
```sh
$ npm start
```
The API will start running on http://localhost:8080 if you don't set a env variable for `PORT`.

## Endpoints

The API provides the following endpoints:

### Default

The default route serves an HTML file as the response, that was made to be used as an interface for file upload. Accessing the root URL (/) via a GET request will return the default HTML file.

### Upload Endpoint
**URL**: `/api/fileanalyse`
**Method**: POST

This endpoint handles file upload requests. Clients should send a POST request to this endpoint with the file included in the request body as multipart/form-data.

**Request Headers**

The following headers are required for the upload endpoint:

- `Content-Type`: Must be set to `multipart/form-dat`.

**Request Body**

The request body should contain the file to be uploaded as multipart/form-data.

**Response**

Upon successful file upload, the API responds with a JSON object containing the metadata of the uploaded file:

```json
{
  "name": "example.jpg",
  "type": "image/jpeg",
  "size": 123456
}
```

- `name`: The name of the uploaded file.
- `type`: The MIME type of the uploaded file.
- `size`: The size of the uploaded file in bytes.

### Error Handling
If the API receives a request to an undefined endpoint, it will respond with a 404 Not Found error.