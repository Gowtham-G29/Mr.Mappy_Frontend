export const storeUserData = (token) => {
    localStorage.setItem('token', token);
  };
  
  export const getUserData = () => {
    return localStorage.getItem('token');
  };
  
  export const removeUserData = () => {
    localStorage.removeItem('token');
  };



  //get the user id from the local storage.
  
  export const loginUserId=()=>{
    return localStorage.getItem('userId')
  }


  // delete the user id from the local storage.
  export const removeUserIdData = () => {
    localStorage.removeItem('userId');
  };

