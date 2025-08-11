import {  DataTypes, Model } from 'sequelize';
import { sequelizer } from '../config/db';
import LoginAttempts from './LoginAttempts';
import { UserAttributes, UserCreationAttributes, } from '../types/index';

class Users extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;
    public role!: 'user' | 'admin';
    loginAttempts?: LoginAttempts;

      
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Users.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
      },
},{
    sequelize: sequelizer,
    modelName: 'Users',
    tableName: 'Users',
  })

export default Users;

