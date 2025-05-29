import LoginAttempts from "../models/LoginAttempts";
import Users from "../models/Users";


export const checkLoginStatus = async (email) => {
    try {
        const user = await Users.findOne({
            where: { email },
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
            const remainingTime = Math.ceil((loginAttempts.lockedUntil - new Date()) / 1000);
            throw new Error(`Account locked. Try again in ${remainingTime} seconds`);
        }
        if (loginAttempts.lockedUntil && new Date() >= loginAttempts.lockedUntil) {
            await loginAttempts.update({
                lockedUntil: null,
                incorrectAttempts: 0
            });
        }
        return { user, isLocked: false };

    } catch (error) {
        console.error("Error checking login status:", error);
        throw new Error('Could not check login status');    
    }
}
export const recordFailedAttempts = async (userId) => {
    try {
        const loginAttempt = await LoginAttempts.findOne({
            where: { userId }
        });

        if (!loginAttempt) {
            await LoginAttempts.create({
                userId,
                incorrectAttempts: 1,
                lockedUntil: null,
                lastAttempt: new Date()
            });
        } else {
            const newAttempts = loginAttempt.incorrectAttempts + 1;
            let lockedUntil = null;

            if (newAttempts % 3 === 0) {
                lockedUntil = new Date(Date.now() + 5 * 60 * 1000); 
            }

            await loginAttempt.update({
                incorrectAttempts: newAttempts,
                lockedUntil,
                lastAttempt: new Date()
            });
        }
        return loginAttempt;

    }
    catch (error) {
        console.error("Error recording failed attempts:", error);
        throw new Error('Could not record failed attempts');
    }
}
export const resetFailedAttempts = async (userId) => {
    try{
        await LoginAttempts.update({
            incorrectAttempts: 0,
            lockedUntil: null,
            lastAttempt: new Date()
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