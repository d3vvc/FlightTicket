import {  DataTypes } from 'sequelize';
import { sequelizer } from '../config/db.js';

const Users = sequelizer.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {    
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
    }, 
        role: {
            type: DataTypes.ENUM('admin', 'user'),
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
})  



export default Users;