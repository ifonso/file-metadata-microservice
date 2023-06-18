import Busboy from "busboy"

/**
 * Parse the multipart/form-data from the request.
 * @param {http.IncomingMessage} request - The incoming HTTP request object.
 * @returns {Promise<{ fileName: string, mimeType: string, fileSize: number }>} A promise that resolves with the parsed file data.
 */
export function parseMultipartFormData(request) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: request.headers})

    let fileData;

    busboy.on("file", (_, file, info) => {
      fileData = {
        fileName: info.filename,
        mimeType: info.mimeType,
        fileSize: 0
      }

      file.on("data", (chunk) => {
        fileData.fileSize += chunk.length;
      });
    });

    busboy.on("finish", () => {
      resolve(fileData);
    });

    busboy.on("error", (error) => {
      reject(error);
    })

    request.pipe(busboy);
  });
}