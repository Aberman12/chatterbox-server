var storage = {
  results: []
};

module.exports.requestHandler = function(request, response) {
  
  var statusCode = 200;
  var defaultCorsHeaders = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, accept",
    "access-control-max-age": 10 // Seconds.
  };
  var headers = defaultCorsHeaders;
  var postResults = [];


  if (request.url !== "/classes/messages") {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end("ERROR 404 NOT FOUND");
  } else if (request.method === "POST") {
    console.log(
      "Serving request type " + request.method + " for url " + request.url
    );
    statusCode = 201;
    response.writeHead(statusCode, headers);
    request
      .on("data", chunk => {
        postResults.push(chunk);
      })
      .on("end", () => {
        postResults = Buffer.concat(postResults).toString();
        storage.results.push(JSON.parse(postResults));
      });
    response.end();
  } else if (request.method === "GET") {
    console.log(
      "Serving request type " + request.method + " for url " + request.url
    );
    statusCode = 200;
    response.writeHead(statusCode, headers);
    headers["Content-Type"] = "application/json";
    response.end(JSON.stringify(storage)); 
  }
};
