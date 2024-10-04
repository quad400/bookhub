export enum BusinessCode {
  CREATED = 300,
  OK = 301,
  UNAUTHORIZED = 304,
  BAD_REQUEST = 305,
  CONFLICT = 306,
  UNPROCESSED_ENTITY = 307,
  NOT_FOUND = 308,
  INTERNAL_SERVER_ERROR = 309,
}

export enum BusinessDescription {
  CREATED = 'Document Successfuly Created',
  OK = 'Sucessful',
  BAD_REQUEST = 'Bad Request',
  CONFLICT = 'Document with required unique value already exist in the database',
  UNPROCESSED_ENTITY = 'Request body passed to this api in not correct',
  NOT_FOUND = 'Document you are requesting for is not in the database or has been deleted',
  INTERNAL_SERVER_ERROR = 'Internal Server error, Kindly Contact developer coderblack@admin.com',
  UNAUTHORIZED = 'User unauthorized to perform this request',
}
