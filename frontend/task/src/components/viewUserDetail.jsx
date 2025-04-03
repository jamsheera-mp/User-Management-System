import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetail } from '../redux/slices/userSlice';

const ViewUserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentProfile, isLoading, error } = useSelector(state => state.users);
  const { user } = useSelector(state => state.auth);
  
  // Check if user is admin
  useEffect(() => {
    const checkAdminAccess = () => {
      if (!user) return false;
      
      // Check if isAdmin property exists directly on user
      if (user.isAdmin === true) return true;
      
      // Try to get data from localStorage if needed
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          if (parsed.isAdmin === true) return true;
          if (parsed.user && parsed.user.isAdmin === true) return true;
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
      
      return false;
    };
    
    // Redirect if not admin
    if (!checkAdminAccess()) {
      navigate('/');
    }
  }, [user, navigate]);
  
  // Fetch user details when component mounts
  useEffect(() => {
    if (userId) {
      console.log("Fetching user details for:", userId);
      dispatch(fetchUserDetail(userId));
    }
  }, [dispatch, userId]);
  
  const handleEditUser = () => {
    navigate(`/admin/users/${userId}/edit`);
  };
  
  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <p className="text-lg">Loading user details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <button
          onClick={handleBackToDashboard}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  if (!currentProfile) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>User not found or data not loaded yet.</p>
        </div>
        <button
          onClick={handleBackToDashboard}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  // Format date for readability
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">User Details</h1>
            <div className="flex space-x-2">
              <button
                onClick={handleEditUser}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
              >
                Edit User
              </button>
              <button
                onClick={handleBackToDashboard}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Back
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            {/* User Avatar */}
            <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
              {currentProfile.profilePicture ? (
                <img
                  src={currentProfile.profilePicture}
                  alt={`${currentProfile.name}'s profile`}
                  className="h-48 w-48 rounded-full object-cover border-4 border-gray-200"
                />
              ) : (
                <div className="h-48 w-48 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 text-6xl">
                    {currentProfile.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            {/* User Information */}
            <div className="md:w-2/3 md:pl-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {currentProfile.name}
                </h2>
                <p className="text-gray-600">{currentProfile.email}</p>
                <div className="mt-2">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    currentProfile.isAdmin 
                      ? "bg-green-100 text-green-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {currentProfile.isAdmin ? "Admin" : "Regular User"}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">User ID</p>
                  <p className="text-gray-800">{currentProfile._id}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Account Created</p>
                  <p className="text-gray-800">{formatDate(currentProfile.createdAt)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="text-gray-800">{formatDate(currentProfile.updatedAt)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-gray-800">
                    {currentProfile.isActive !== undefined ? (
                      currentProfile.isActive ? "Active" : "Inactive"
                    ) : "Active"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional User Data (if available) */}
          {currentProfile.address && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Address</h3>
              <p className="text-gray-600">{currentProfile.address}</p>
            </div>
          )}
          
          {currentProfile.bio && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Bio</h3>
              <p className="text-gray-600">{currentProfile.bio}</p>
            </div>
          )}
          
          {/* Custom fields section - can be expanded based on your data model */}
          {currentProfile.customFields && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(currentProfile.customFields).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm font-medium text-gray-500">{key}</p>
                    <p className="text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewUserDetails;