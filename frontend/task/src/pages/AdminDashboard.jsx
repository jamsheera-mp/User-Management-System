import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUsers, 
  deleteUser, 
  searchUsers,
  fetchUserDetail
} from '../redux/slices/userSlice';
import { getUserProfile } from '../redux/slices/authSlice'; 
import {  useNavigate } from 'react-router-dom';
import {increment,decrement} from '../redux/slices/counterSlice'

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, isLoading, error } = useSelector(state => state.users);
  const { user, isAuthenticated, isLoading: authLoading ,token} = useSelector(state => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const {count} = useSelector((state)=>state.count)

  // Fetch user profile on mount if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !user && token) {
      dispatch(getUserProfile())
        .unwrap()
        .catch(() => {
          navigate('/login')// Redirect if token invalid
        })
    }
  }, [dispatch, isAuthenticated, user, token, navigate]);

 
  
  // Check if user is admin based on Redux state
  const checkAdminAccess = () => {
    if (!user || !isAuthenticated) return false;
    return user.isAdmin === true;
  };

   // Fetch users once admin is confirmed
  useEffect(() => {
    if (isAuthenticated && checkAdminAccess()) {
      dispatch(fetchUsers());
    }
  }, [dispatch, isAuthenticated,user]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchUsers(searchQuery));
    } else {
      dispatch(fetchUsers());
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setIsDeleting(true);
      try {
        await dispatch(deleteUser(userId)).unwrap();
        alert('User deleted successfully');
      } catch (error) {
        alert(`Failed to delete user: ${error}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEditUser = (userId) => {
    dispatch(fetchUserDetail(userId));
    navigate(`/admin/users/edit/${userId}`);
  };

  const handleViewProfile = (userId) => {
    dispatch(fetchUserDetail(userId));
    navigate(`/admin/users/${userId}`);
  };

  // Loading state while fetching auth
  if (authLoading) {
    return <div className="container mx-auto p-4">Loading authentication...</div>;
  }

  // Check admin access
  if (!isAuthenticated || !checkAdminAccess()) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Access Denied: You do not have admin privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded flex-grow"
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
          {searchQuery && (
            <button 
              type="button"
              onClick={() => {
                setSearchQuery('');
                dispatch(fetchUsers());
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Clear
            </button>
          )}
        </form>
      </div>
 <p>Total number of users:{users.length}</p>

 <h1>Count:{count}</h1>
      <button onClick={()=>dispatch(increment())}>Increment</button>
      <button onClick={()=>dispatch(decrement())}>Decrement</button> 
     
      
      {/* Users Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-center">Loading users...</div>
        ) : users && users.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((userData) => (
                <tr key={userData._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {userData.profilePicture ? (
                          <img 
                            src={userData.profilePicture} 
                            alt={`${userData.name}'s profile`}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600">
                              {userData.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {userData.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {userData._id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{userData.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewProfile(userData._id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEditUser(userData._id)}
                      className="text-yellow-600 hover:text-yellow-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(userData._id)}
                      disabled={isDeleting || userData._id === user?._id}
                      className={`${
                        userData._id === user?._id
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-red-600 hover:text-red-900"
                      }`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-4 text-center">No users found</div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;