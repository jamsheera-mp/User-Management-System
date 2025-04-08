import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../redux/slices/authSlice";
import ProfilePictureUpload from "../components/ProfilePictureUpload";
import EditUserProfile from "../components/EditUserProfile";

const UserProfile = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.auth);
  const [isEditing,setIsEditing] = useState(false)


  // Fetch user profile when component mounts
  useEffect(() => {
    if (auth.isAuthenticated) {
      dispatch(getUserProfile());
    }
  }, [dispatch, auth.isAuthenticated]);

  // Debug logging 
  useEffect(() => {
    console.log("Auth user from Redux:", auth.user.user);
  }, [auth.user]);

  const profileData = auth.user;

  if (isLoading || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-xl">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        {isEditing ? (
          <EditUserProfile setIsEditing={setIsEditing} />
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-700 text-center ">
                User Profile
              </h1>
             
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-medium text-gray-700 mb-4">
                Welcome, {profileData.name}
              </h3>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Name:</span> {profileData.name}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Email:</span> {profileData.email}
                </p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Edit Profile
              </button>
            </div>
            

            {/* Profile Picture Upload Component */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Profile Picture</h3>
              <ProfilePictureUpload />
            </div>
          </>
        )}
      </div>
    </div>
  )
};

export default UserProfile;