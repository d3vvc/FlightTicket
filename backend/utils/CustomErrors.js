
export class AuthenticationError extends Error {
    constructor(message = 'Authentication failed') {
        super(message);
        this.name = 'AuthenticationError';
        this.statusCode = 401; 
    }
}


export class AuthorizationError extends Error {
    constructor(message = 'Authorization failed') {
        super(message);
        this.name = 'AuthorizationError';
        this.statusCode = 403; 
    }
}

export class NotFoundError extends Error {
    constructor(message = 'Resource not found') {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404; 
    }
}

export class DatabaseError extends Error {
    constructor(message = 'Database operation failed') {
        super(message);
        this.name = 'DatabaseError';
        this.statusCode = 500; 
    }
}
