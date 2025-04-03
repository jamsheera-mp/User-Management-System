
export const getAuthToken = () => {
    // First try to get from local storage(bcz,backend is sending in different ways in differnt controller)
    const token = localStorage.getItem("token");
    if (token) return token;
    
    // If not direct token, try to parse from user data
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.token) return parsed.token;
      if (parsed.user && parsed.user.token) return parsed.user.token;
    }
    
    return null;
  };

  