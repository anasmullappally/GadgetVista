/**
 * All the status code which are using in this service are listed here
 */

export const HTTP_STATUS_OK = 200; // The request was successful and the server returned the requested information.
export const HTTP_STATUS_CREATED = 201; // The request was successful and the server created a new resource as a result.
export const HTTP_STATUS_NO_CONTENT = 204; // The request was successful, but there is no representation to return.
export const HTTP_STATUS_INTERNAL_ERROR = 500; // Internal Server or database error i.e error due to programming mistakes.
export const HTTP_STATUS_FORBIDDEN = 403; // Not granted, permission denied, not authorized.
export const HTTP_STATUS_ROUTE_NOT_FOUND = 404; // if api not found
export const HTTP_BAD_REQUEST = 400; // If fields missing, entered something wrong.
export const HTTP_STATUS_NOT_FOUND = 401; // Not found
export const HTTP_STATUS_PAYMENT_REQUIRED = 402; // payment required, insufficient balance
export const HTTP_STATUS_CONFLICT = 409; // Indicate that something already exists.
export const HTTP_STATUS_NO_RESOURCE = 410; // Indicate that something already exists.
export const HTTP_STATUS_UNPROCESSABLE = 422; // server understands the request but cannot process
