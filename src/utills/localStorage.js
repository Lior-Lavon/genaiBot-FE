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

export const setSecurityTokenInLocalStorage = (code) => {
  localStorage.setItem("SecurityAuth", JSON.stringify(code));
};

export const getSecurityTokenFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("SecurityAuth")) || null;
};

export const clearSecurityTokenFromLocalStorage = () => {
  localStorage.removeItem("SecurityAuth");
};
