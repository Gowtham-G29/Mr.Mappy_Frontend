import { getUserData, removeUserData, removeUserIdData } from "./Storage";

export const isAuthenticated = () => {
  return getUserData() != null;
};

export const logout = () => {
  removeUserData();
  removeUserIdData();
};
