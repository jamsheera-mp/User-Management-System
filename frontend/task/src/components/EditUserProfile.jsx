import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  updateUserProfile } from "../redux/slices/authSlice";



const EditUserProfile = ({ setIsEditing }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const userData = auth.user;
  
  const [formData, setFormData] = useState({
   
    name: userData?.name || "",
    email: userData?.email || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
       console.log("submitting form data",formData);
       
      const resultAction = await dispatch(updateUserProfile(formData)).unwrap();
      console.log('user data updated: ',resultAction);
      
      setSuccess(true);
      setTimeout(() => {
        setIsEditing(false);
      }, 1500);
    } catch (err) {
      
      console.error("Error updating profile:", err.message|| err.response?.data?.message || err.toString());
      setError(err.message|| err.response?.data?.message || err.toString()|| "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Profile updated successfully!
        </div>
      )}
      
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
        
        <div className="mb-6">
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
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${
              isSubmitting ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
            } text-white font-bold py-2 px-4 rounded`}
          >
            {isSubmitting ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserProfile;