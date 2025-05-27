import Users from "../../models/Users.js";

export const registerDB = async (username, password, email, role) => {
    try{
        const newUser = await Users.create({ username, password, email, role });
        return newUser;
    } catch (error) {
        console.error("Error registering user:", error);
        throw new Error('User already exists');
    }
}

export const loginDB = async (username, password) => {
    try {
        const user = Users.findOne({ where: { username } });
        if (!user) {
            throw new Error('User not found');
        }
        if (!user.comparePassword(password)) {
            throw new Error('Invalid credentials');
        }
        return user;
    } catch (error) {
        console.error("Error logging in user:", error);
        throw error;
    }
}