import fs from "fs";
import path from "path";

import { parseMultipartFormData } from "./services.mjs";

class Router {
  /**
   * Handles incoming file upload requests and send its metadata as a JSON.
   *
   * @param {http.IncomingMessage} request - The incoming HTTP request object.
   * @param {http.ServerResponse} response - The HTTP response object.
   * @returns {void}
   */
  async #upload(request, response) {
    try {
      const data = await parseMultipartFormData(request);

      response.writeHead(200, {
        "Content-Type": "application/json"
      });

      response.end(
        JSON.stringify({
          "name": data.fileName,
          "type": data.mimeType,
          "size": data.fileSize
        })
      )
    } catch (error) {
      response.writeHead(500, {
        "Content-Type": "text/plain"
      });

      response.end("Error occurred: " + error.message);
    }
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
  async handler(request, response) {
    const { method, url } = request;

    // Main Page
    if (url === "/" && method === "GET") {
      response.setHeader("Access-Control-Allow-Origin", "*");
      return this.#default.apply(this, [response]);
    }

    // Upload
    if (url === "/api/fileanalyse" && method === "POST") {
      response.setHeader("Access-Control-Allow-Origin", "*");
      return await this.#upload.apply(this, [request, response]);
    }

    // Not Found
    response.writeHead(404, { "Conten-Type": "text/plain" });
    response.end("Not Found");
  }
}

export default Router;