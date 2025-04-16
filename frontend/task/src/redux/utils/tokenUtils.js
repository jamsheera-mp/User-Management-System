

export const getAuthToken = (state) => {
  
    return state.auth.accessToken || null; 
  };

  

//export const getAuthToken = () => {
  //const state = store.getState();
  //return state.auth.accessToken|| null; 
//};