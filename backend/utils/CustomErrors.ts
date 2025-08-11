
export class AuthenticationError extends Error {
    public statusCode: number;
    constructor(message = 'Authentication failed') {
        super(message);
        this.name = 'AuthenticationError';
        this.statusCode = 401; 
    }
}


export class AuthorizationError extends Error {
    public statusCode: number;
    constructor(message = 'Authorization failed') {
        super(message);
        this.name = 'AuthorizationError';
        this.statusCode = 403; 
    }
}

export class NotFoundError extends Error {
    public statusCode: number;
    constructor(message = 'Resource not found') {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404; 
    }
}

export class DatabaseError extends Error {
    public statusCode: number;
    constructor(message = 'Database operation failed') {
        super(message);
        this.name = 'DatabaseError';
        this.statusCode = 500; 
    }
}
