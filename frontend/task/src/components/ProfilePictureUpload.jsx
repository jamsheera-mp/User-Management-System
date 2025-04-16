import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadProfilePicture } from "../redux/slices/authSlice";

const ProfilePictureUpload = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { user,isLoading ,error} = useSelector((state) => state.auth);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  //const user = auth.user;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size if needed
      if (!file.type.match('image.*')) {
        setErrorMessage("Please select an image file");
        return;
      }
      
      if (file.size > 5000000) { // 5MB limit
        setErrorMessage("File size should be less than 5MB");
        return;
      }
      
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Show preview
      setErrorMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file first");
      return;
    }

    //let userId;
    //if (user?._id) {
      //userId = typeof user._id === 'object' ? user._id.id || user._id.toString() : user._id;
    //} else if (user?.id) {
      //userId = typeof user.id === 'object' ? user.id.id || user.id.toString() : user.id;
   // }
    //if (!userId) {
      //setErrorMessage("User ID not found. Please log in again.");
      //console.error("Missing user ID. Current user state:", user);
      //return;
    //}

   // console.log("Using userId:", userId); 

    const formData = new FormData();
    formData.append("profilePicture", selectedFile);
   // formData.append("userId", userId||user._id||user.id);
    setUploading(true);
    setErrorMessage(null);

    try {
      // Dispatch the uploadProfilePicture action with formData
      const resultAction = await dispatch(uploadProfilePicture(formData)).unwrap()

      if (uploadProfilePicture.fulfilled.match(resultAction)) {
        console.log("Upload successful:", resultAction.payload);
  
        // Clear the file input
        setSelectedFile(null);
        setPreview(null);
      } else {
        setErrorMessage(resultAction.payload || "Upload failed");
        console.error("Upload failed:", resultAction);
      }
    } catch (error) {
      setErrorMessage(error?.message||"An unexpected error occurred");
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  // Determine which image to show
  const profileImage =  auth?.user?.profilePicture || preview

  return (
    <div className="flex flex-col items-center">
      {profileImage ? (
        <img
          src={profileImage}
          alt="Profile"
          className="w-32 h-32 rounded-full mb-4 border shadow object-cover"
        />
      ) : (
        <div className="w-32 h-32 rounded-full mb-4 border shadow bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}

      <input
        type="file"
        className="mb-3"
        accept="image/*"
        onChange={handleFileChange}
      />

      {errorMessage && (
        <p className="text-red-500 mb-2 text-sm">{errorMessage}</p>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || !selectedFile}
        className={`w-full ${
          uploading || !selectedFile
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white p-3 rounded-lg transition-all`}
      >
        {uploading ? "Uploading..." : "Upload Profile Picture"}
      </button>
    </div>
  );
};

export default ProfilePictureUpload;

