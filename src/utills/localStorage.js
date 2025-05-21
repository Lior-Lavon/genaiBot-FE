export const setUserInLocalStorage = (user) => {
  localStorage.setItem("profile", JSON.stringify(user));
};

export const getUserFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("profile")) || null;
};

export const clearUserFromLocalStorage = () => {
  localStorage.removeItem("profile");
};

//-----------------------------

export const setSessionInLocalStorage = (user) => {
  localStorage.setItem("Session", JSON.stringify(user));
};

export const getSessionFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("Session")) || null;
};

export const clearSessionFromLocalStorage = () => {
  localStorage.removeItem("Session");
};

//-----------------------------

export const setUserIdInLocalStorage = (user) => {
  localStorage.setItem("userId", JSON.stringify(user));
};

export const getUserIdFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("userId")) || null;
};

export const clearUserIdFromLocalStorage = () => {
  localStorage.removeItem("userId");
};
