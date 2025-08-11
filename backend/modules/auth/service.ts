import Users from "../../models/Users";
import { AuthenticationError, AuthorizationError, NotFoundError } from "../../utils/CustomErrors";
import { resetFailedAttempts, recordFailedAttempts, checkLoginStatus } from '../../services/LoginSecurity';
import { UserAttributes, UserCreationAttributes } from "../../types/index";
import bcrypt from "bcrypt";


export const registerDB = async (params: UserCreationAttributes): Promise<UserAttributes> => {
    if (!params.username || !params.password || !params.email || !params.role) {
        throw new AuthenticationError('All fields are required');
    }
    const hashedPassword = await bcrypt.hash(params.password, 10);
        const newUser: UserAttributes = await Users.create({...params, password: hashedPassword});
    if (!newUser) {
        throw new AuthenticationError('User registration failed');   
    }
        return newUser;
}

export const loginDB = async (username: string, password: string): Promise<UserAttributes> => {

    if (!username || !password) {
        throw new AuthenticationError('Username and password are required');
        
    }
    const loginAttempts = await checkLoginStatus(username);
  
    if (loginAttempts.isLocked) {
        throw new AuthorizationError('Account is locked due to multiple failed login attempts. Please try again later.');
    }
        const user = await Users.findOne({ where: { username: username } });
        
    if (!user) {
        throw new NotFoundError('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        await recordFailedAttempts(user.id);
        throw new AuthenticationError('Invalid password');
    }
    await resetFailedAttempts(user.id);
    return user;
   
}

export const sendOTP_DB = async (email: string): Promise<UserAttributes | null> => {

     const user = await Users.findOne({ where: { email } });
    return user
    
}

export const resetPWD_DB = async (email: string, password: string): Promise<boolean> => {
  
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundError('User not found');
        }
        user.password = password;
        await user.save();
        return true
}