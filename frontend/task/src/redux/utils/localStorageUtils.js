// Store user data in localStorage
export const storeUserData = (userData) => {
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
    
    localStorage.setItem("user", JSON.stringify(userData));
  };
  
  // Get user data from localStorage
  export const getUserFromStorage = () => {
    const userData = localStorage.getItem("user");
    if (!userData) return null;
  
    const parsed = JSON.parse(userData);
  
    // If the user data has a nested user object with profilePicture
    if (parsed.user && parsed.user.profilePicture) {
      return {
        ...parsed.user,
        token: parsed.token,
      };
    }
  
    // If the user data already has token inside the user object
    if (parsed.user && parsed.user.token) {
      return parsed.user;
    }
    
    // If token is separate from user data, add it to the user object
    if (parsed.user && parsed.token) {
      return {
        ...parsed.user,
        token: parsed.token,
      };
    }
  
    // If no nested user object
    if (parsed.token) {
      return parsed;
    }
    
    return parsed;
  };
  
  // Update profile picture in localStorage
  export const updateProfilePictureInStorage = (imageUrl) => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedData = JSON.parse(userData);
  
      // Handle different storage structures
      if (parsedData.user) {
        // If there's a nested user object
        parsedData.user.profilePicture = imageUrl;
      } else {
        // If user data is stored directly
        parsedData.profilePicture = imageUrl;
      }
  
      localStorage.setItem("user", JSON.stringify(parsedData));
    }
  };
  
  // Remove user data from localStorage
  export const removeUserFromStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };