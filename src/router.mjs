import fs from "fs";
import path from "path";
import busboy from "busboy";

class Router {
  /**
   * Handles incoming file upload requests and send its metadata as a JSON.
   *
   * @param {http.IncomingMessage} request - The incoming HTTP request object.
   * @param {http.ServerResponse} response - The HTTP response object.
   * @returns {void}
   */
  #upload(request, response) {
    const handler = busboy({ headers: request.headers });

    let fileName;
    let mimeType;
    let fileSize;

    handler.on("file", (fildname, file, info) => {
      fileName = info.filename;
      mimeType = info.mimeType;
      fileSize = 0;

      file.on("data", (data) => {
        fileSize += data.length;
      });
    });

    handler.on("close", () => {
      response.writeHead(200, {
        "Content-Type": "application/json"
      });

      response.end(
        JSON.stringify({
          "name": fileName,
          "type": mimeType,
          "size": fileSize
        })
      );
    });

    request.pipe(handler);
  }

  /**
   * Handles the default route and sends the default HTML file as the response.
   *
   * @param {http.ServerResponse} response - The HTTP response object.
   * @returns {void}
   */
  #default(response) {
    const filePath = path.join(process.cwd(), "public", "index.html");
    const stream = fs.createReadStream(filePath);
    
    response.writeHead(200, {
      "Content-Type": "text/html"
    });

    stream.pipe(response);
  }

  /**
   * Handles incoming HTTP requests and routes them to the appropriate handlers.
   *
   * @param {http.IncomingMessage} request - The incoming HTTP request object.
   * @param {http.ServerResponse} response - The HTTP response object.
   * @returns {void}
   */
  handler(request, response) {
    const { method, url } = request;

    // Main Page
    if (url === "/" && method === "GET") {
      response.setHeader("Access-Control-Allow-Origin", "*");
      return this.#default.apply(this, [response]);
    }

    // Upload
    if (url === "/api/fileanalyse" && method === "POST") {
      response.setHeader("Access-Control-Allow-Origin", "*");
      return this.#upload.apply(this, [request, response]);
    }

    // Not Found
    response.writeHead(404, { "Conten-Type": "text/plain" });
    response.end("Not Found");
  }
}

export default Router;