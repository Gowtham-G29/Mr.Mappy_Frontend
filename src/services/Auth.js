
export const isAuthenticated = () => {
  const token = localStorage.getItem('jwt');
  if (token) {
    return true;
  } else {
    return false;
  }
};

export const removeAuthentication = () => {
  localStorage.removeItem('jwt');

}

export const logout = () => {
  removeAuthentication();
};
