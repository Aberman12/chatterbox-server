/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

module.exports = requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;
  var results = {
    results: []
  };
  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'text/plain';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);
  
  let postResults = [];
  let getResults = [];
  let finalResults = [];
  let storage = {
    'results': []
  };

  // if (request.url === '/classes/messages') {
  //   if (request.method === 'POST') {
  //     request.on('data', (chunk) => {
  //       console.log('chunk', chunk);
  //       postResults.push(chunk);    
  //     }).on('end', () => {      
  //       postResults = Buffer.concat(postResults).toString();
  //       console.log('postResults', postResults);
  //       var parsedResults = JSON.parse(postResults);
  //       console.log('parsedResults', parsedResults);
  //       finalResults.push(JSON.stringify(parsedResults));
  //       console.log('finalResults', finalResults);
  //       storage.results = finalResults;
  //       console.log('storage.results', storage.results);
  //       response.writeHead(201, headers);
  //       console.log('storage', storage);
  //       response.end(storage);      
  //     });
  //   } else if (request.method === 'GET') {
  //       request.on('data', (messages) => {
  //         getResults.push(messages);
  //         // console.log('69', messages);
  //       }).on('end', () => {
  //         getResults = Buffer.concat(getResults).toString();
  //         response.writeHead(200, headers);      
  //         // console.log('END GET', getResults);
  //         response.end();
  //       });
  //     } else  {
  //       response.writeHead(404, {'Content-Type': 'text/plain'});      
  //   }
  // } else {
  //   response.writeHead(404, {'Content-Type': 'text/plain'});      
  // }

  if (request.method === 'POST' && request.url === '/classes/messages') {
    request.on('data', (chunk) => {
      postResults.push(chunk);
    }).on('end', () => {      
      postResults = Buffer.concat(postResults).toString();
      var parsedResults = JSON.parse(postResults);
      postResults = parsedResults;
      response.writeHead(201, headers);
      console.log('end of post', postResults);
      response.end(JSON.stringify(storage.results = [postResults]));
  
    });
  }
  

  if (request.method === 'GET' && request.url === '/classes/messages') { 
    console.log(' first test', request.data, request.method, request.url) 
      response.writeHead(200, headers);      
      console.log('END GET', getResults);
      response.end(storage);
  }

  request.on('error', (err) => {
    console.error('error');
  });

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};