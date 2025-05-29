import { DataTypes } from "sequelize";
import { sequelizer } from "../config/db.js";

const LoginAttempts = sequelizer.define("LoginAttempts", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    incorrectAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    lockedUntil: {
        type: DataTypes.DATE,
        allowNull: true
    },
    lastAttemptAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

export default LoginAttempts;
