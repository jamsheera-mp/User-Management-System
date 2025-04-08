import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUsers, 
  deleteUser, 
  searchUsers,
  fetchUserDetail
} from '../redux/slices/userSlice';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { users, isLoading, error } = useSelector(state => state.users); 
  const { user } = useSelector(state => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  

  
  // Fetch all users when component mounts
  useEffect(() => {
    // First verify that the user exists and has admin privileges
  const checkAdminAccess = () => {
    if (!user) return false;
    
    // Check if isAdmin property exists directly on user
    if (typeof user.isAdmin === 'boolean') return user.isAdmin;
    
    // Try to get data from localStorage if needed
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.user && parsed.user.isAdmin) return true;
    }
    
    return false;
  };
  
  if (checkAdminAccess()) {
    dispatch(fetchUsers());
  }
  }, [dispatch, user]);

  const checkAdminAccess = () => {
    if (!user) return false;
    
    // Check if isAdmin property exists directly on user
    if (user.isAdmin === true) return true;
    
    // Try to get data from localStorage if needed
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        // Check different possible paths
        if (parsed.isAdmin === true) return true;
        if (parsed.user && parsed.user.isAdmin === true) return true;
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    
    return false;
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchUsers(searchQuery));
    } else {
      // If search is cleared, fetch all users again
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

 
  const handleEdituser = (userId) => {
    dispatch(fetchUserDetail(userId))
    navigate(`/admin/users/edit/${userId}`)
  }

  
  // Handle viewing user profile
  const handleViewProfile = (userId) => {
    dispatch(fetchUserDetail(userId));
    navigate(`/admin/users/${userId}`); 
  };
  
  // Check if user is admin
  if (user && !checkAdminAccess()) {
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
      
      
      
      {/* Users Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-center">Loading users...</div>
        ) : users && users.length > 0 ? ( // Added null check and changed usersList to users
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
                     onClick={()=>handleEdituser(userData._id)}
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