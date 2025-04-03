import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../redux/slices/authSlice";
import ProfilePictureUpload from "../components/ProfilePictureUpload";

const UserProfile = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.auth);

  // Fetch user profile when component mounts
  useEffect(() => {
    if (auth.isAuthenticated) {
      dispatch(getUserProfile());
    }
  }, [dispatch, auth.isAuthenticated]);

  // Debug logging (can be removed in production)
  useEffect(() => {
    console.log("Auth user from Redux:", auth.user);
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
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Welcome, {profileData.name}
        </h2>

        <p className="text-gray-600 text-sm mb-2">
          <strong>Email:</strong> {profileData?.email}
        </p>

        {/* Profile Picture Upload Component */}
        <ProfilePictureUpload />
      </div>
    </div>
  );
};

export default UserProfile;