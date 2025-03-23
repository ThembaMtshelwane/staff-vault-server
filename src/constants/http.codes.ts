// ******** Successful responses

//The request succeeded. The result and meaning of "success" depends on the HTTP method
export const OK = 200;

//The request succeeded, and a new resource was created as a result. This is typically the response sent after POST requests, or some PUT requests.
export const CREATED = 201;

// ******** Client error responses

//The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
export const BAD_REQUEST = 400;

//Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
export const UNAUTHORIZED = 401;

//The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401 Unauthorized, the client's identity is known to the server.
export const FORBIDDEN = 403;

//The server cannot find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 Forbidden to hide the existence of a resource from an unauthorized client. This response code is probably the most well known due to its frequent occurrence on the web.
export const NOT_FOUND = 404;

// ******** Server error responses

//The server has encountered a situation it does not know how to handle. This error is generic, indicating that the server cannot find a more appropriate 5XX status code to respond with.
export const INTERNAL_SERVER_ERROR = 500;
