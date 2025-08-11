import LoginAttempts from "../models/LoginAttempts";
import Users from "../models/Users";
import { UserwithLoginAttempts } from "../types/index";

interface userWithLockedStatus {
    user: UserwithLoginAttempts;
    isLocked: boolean;
}

export const checkLoginStatus = async (username: string): Promise<userWithLockedStatus> => {
    try {
        const user: UserwithLoginAttempts | null = await Users.findOne({
            where: { username },
            include: [{
                model: LoginAttempts,
                as: 'loginAttempts'
            }]
        })

        if (!user) {
            throw new Error('User not found');
        }

        const loginAttempts = user.loginAttempts;
        if (!loginAttempts) {
            return {user,  isLocked: false };
        }

        if (loginAttempts.lockedUntil && new Date() < loginAttempts.lockedUntil) {
            const remainingTime = Math.ceil((Number(loginAttempts.lockedUntil) - Number(new Date())) / 1000);
            throw new Error(`Account locked. Try again in ${remainingTime} seconds`);
        }
        if (loginAttempts.lockedUntil && new Date() >= loginAttempts.lockedUntil) {
            await loginAttempts.update({
                lockedUntil: null,
                incorrectAttempts: 0
            },);
        }
        return { user, isLocked: false };

    } catch (error) {
        console.error("Error checking login status:", error);
        throw new Error('Could not check login status');    
    }
}
export const recordFailedAttempts = async (userId: number): Promise<LoginAttempts> => {
    try {
        let loginAttempt = await LoginAttempts.findOne({
            where: { userId }
        });

        if (!loginAttempt) {
            loginAttempt = await LoginAttempts.create({
                userId,
                incorrectAttempts: 1,
                lockedUntil: null,
                lastAttemptAt: new Date()
            });
        } else {
            const newAttempts = loginAttempt.incorrectAttempts + 1;
            let lockedUntil: Date = new Date();

            if (newAttempts % 3 === 0) {
                lockedUntil = new Date(Date.now() + 5 * 60 * 1000); 
            }

            await loginAttempt.update({
                incorrectAttempts: newAttempts,
                lockedUntil,
                lastAttemptAt: new Date()
            });
        }
        return loginAttempt;

    }
    catch (error) {
        console.error("Error recording failed attempts:", error);
        throw new Error('Could not record failed attempts');
    }
}
export const resetFailedAttempts = async (userId: number): Promise<void> => {
    try{
        await LoginAttempts.update({
            incorrectAttempts: 0,
            lockedUntil: null,
            lastAttemptAt: new Date()
        }
            ,
            {
            where: { userId },
        })
    }
    catch (error) {
        console.error("Error resetting failed attempts:", error);
        throw new Error('Could not reset failed attempts');
    }
}