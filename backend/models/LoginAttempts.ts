import { DataTypes, Model } from "sequelize";
import { sequelizer } from "../config/db";
import { LoginAttemptsAttributes, LoginAttemptsCreationAttributes } from "../types/index";

class LoginAttempts extends Model<LoginAttemptsAttributes, LoginAttemptsCreationAttributes> implements LoginAttemptsAttributes {
    public id!: number;
    public userId!: number;
    public incorrectAttempts!: number;
    public lockedUntil!: Date;
    public lastAttemptAt!: Date;
    
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

LoginAttempts.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    incorrectAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    lockedUntil: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    lastAttemptAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize: sequelizer,
    modelName: "LoginAttempts",
    tableName: "LoginAttempts",
})

export default LoginAttempts;