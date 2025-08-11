// components/Auth/RegisterForm.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Shield } from 'lucide-react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
};

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    role: 'user', 
  });
  const { setLoading, setError, loading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(formData);
      if (response.success) {
        const { data, token } = response;
        console.log('User registered:', data);
        useAuthStore.getState().login(data, token);
        navigate('/'); 
      }

    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as 'user' | 'admin';
    setFormData({ ...formData, role });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Create Account
          </motion.h2>
          <p className="text-gray-400">Join Airline POC today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <Input
              label="Username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter your username"
              icon={<User className="h-5 w-5 text-blue-400" />}
              className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-1">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              icon={<Mail className="h-5 w-5 text-blue-400" />}
              className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              icon={<Lock className="h-5 w-5 text-blue-400" />}
              className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Role</label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 h-5 w-5 text-blue-400 pointer-events-none z-10" />
              <select
                value={formData.role}
                onChange={handleRoleChange}
                className="block w-full pl-10 pr-4 py-3 border-2 border-gray-600 rounded-lg bg-gray-900 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200"
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Create Account
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <span className="text-blue-400 font-semibold cursor-pointer hover:text-blue-300 transition-colors duration-200">
              Sign in instead
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};
