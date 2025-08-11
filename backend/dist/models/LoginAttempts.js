"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
class LoginAttempts extends sequelize_1.Model {
}
LoginAttempts.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    incorrectAttempts: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    lockedUntil: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    lastAttemptAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_1.sequelizer,
    modelName: "LoginAttempts",
    tableName: "LoginAttempts",
});
exports.default = LoginAttempts;
