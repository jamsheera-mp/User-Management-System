import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetail, updateUser } from '../redux/slices/userSlice';

const EditUserForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const {  isLoading, error } = useSelector(state => state.users);
  const currentProfile = useSelector((state) => state.users.currentProfile);
console.log("Component received profile:", currentProfile);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isAdmin: false
  });
  const [updateMessage, setUpdateMessage] = useState('');
  
  // Fetch user data when component mounts
  useEffect(() => {
    dispatch(fetchUserDetail(userId));
  }, [dispatch, userId]);
  
  // Update form data when user profile is loaded
  useEffect(() => {
    if (currentProfile && Object.keys(currentProfile).length > 0) {
        console.log("Current profile received:", currentProfile);
        setFormData({
            name: currentProfile.name || '',
            email: currentProfile.email || '',
            isAdmin: currentProfile.isAdmin || false
        });
    }else{
        console.log("Current profile is undefined or empty");
        
    }
}, [currentProfile]);

  
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };
  const [isUpdating, setIsUpdating] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true)
    try {
      await dispatch(updateUser({ userId, updatedData: formData })).unwrap();
      setUpdateMessage('User updated successfully!');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    } catch (err) {
      setUpdateMessage(`Error updating user: ${err.message}`);
    }finally{
      setIsUpdating(false)
    }
  };
  
  if (isLoading) {
    return <div className="container mx-auto p-4">Loading user data...</div>;
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      
      {updateMessage && (
        <div className={`px-4 py-3 rounded mb-4 ${updateMessage.includes('Error') ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'}`}>
          <p>{updateMessage}</p>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          {/*<div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isAdmin"
                checked={formData.isAdmin}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-700 text-sm font-bold" style={{display:'none'}}>Admin Privileges</span>
            </label>
          </div>*/}
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update User
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserForm;