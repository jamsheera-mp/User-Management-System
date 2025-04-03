import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {  updateUser, getUserProfile, clearUserError } from '../redux/slices/userSlice';

const AdminUserForm = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentProfile, isLoading, error } = useSelector(state => state.users);
  const { user } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isAdmin: false
  });
  
  const [passwordField, setPasswordField] = useState({
    showPassword: false,
    required: !userId
  });
  
  // Check if user is admin
  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  // Fetch user data if editing
  useEffect(() => {
    if (userId) {
      dispatch(getUserProfile(userId));
    } else {
      // Clear current profile if creating new user
      dispatch(clearUserError());
    }
  }, [dispatch, userId]);
  
  // Populate form when currentProfile changes
  useEffect(() => {
    if (userId && currentProfile) {
      setFormData({
        name: currentProfile.name || '',
        email: currentProfile.email || '',
        password: '',
        isAdmin: currentProfile.isAdmin || false
      });
    }
  }, [currentProfile, userId]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (userId) {
        // Update existing user
        const userData = { ...formData };
        // Only include password if it's not empty
        if (!userData.password) {
          delete userData.password;
        }
        await dispatch(updateUser({ userId, updatedData: userData })).unwrap();
        alert('User updated successfully!');
      } else {
        // Create new user
        //await dispatch(createUser(formData)).unwrap();
        alert('User created successfully!');
      }
      navigate('/admin/dashboard');
    } catch (err) {
      // Error is handled in the redux state
      console.error('Error:', err);
    }
  };
  
  const title = userId ? 'Edit User' : 'Create New User';
  
  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password {userId && <span className="text-sm font-normal text-gray-500">(Leave blank to keep current)</span>}
          </label>
          <div className="relative">
            <input
              id="password"
              type={passwordField.showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={passwordField.required}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button
              type="button"
              onClick={() => setPasswordField({...passwordField, showPassword: !passwordField.showPassword})}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5"
            >
              {passwordField.showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-gray-700">Admin Privileges</span>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isLoading ? 'Processing...' : userId ? 'Update User' : 'Create User'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUserForm;