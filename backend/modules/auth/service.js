import Users from "../../models/Users.js";
import { AuthenticationError, AuthorizationError, NotFoundError } from "../../utils/CustomErrors.js";
import { resetFailedAttempts, recordFailedAttempts, checkLoginStatus } from '../../services/LoginSecurity.js';

export const registerDB = async (username, password, email, role) => {
    if (!username || !password || !email || !role) {
        throw new AuthenticationError('All fields are required');
    }
        const newUser = await Users.create({ username, password, email, role });
    if (!newUser) {
        throw new AuthenticationError('User registration failed');   
    }
        return newUser;
}

export const loginDB = async (username, password) => {

    if (!username || !password) {
        throw new AuthenticationError('Username and password are required');
        
    }
    const loginAttempts = await checkLoginStatus(username);
    if (loginAttempts.isLocked) {
        throw new AuthorizationError('Account is locked due to multiple failed login attempts. Please try again later.');
    }
        const user = Users.findOne({ where: { username } });
        
    if (!user) {
        throw new NotFoundError('User not found');
    }
    if (user.password !== password) {
        await recordFailedAttempts(user);
        throw new AuthenticationError('Invalid password');
    }
    await resetFailedAttempts(username);
    return user;
   
}