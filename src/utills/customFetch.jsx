import axios from "axios";
// import history from "./history";
// import { logout } from "../features/user/userSlice";
// import { clearAdvertStore } from "../features/advert/advertSlice";
import {
  getSessionFromLocalStorage,
  setSessionInLocalStorage,
} from "./localStorage";

const customFetch = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  mode: "cors",
  credentials: "include",
  rejectUnauthorized: false, // Ignore certificate errors
  crossDomain: true,
});

export const interceptor = (store) => {
  customFetch.interceptors.request.use(
    async (config) => {
      const token = getSessionFromLocalStorage();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
        config.headers["Access-Control-Allow-Origin"] = "*";
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  // customFetch.interceptors.response.use(
  //   (response) => {
  //     return response;
  //   },
  //   async (error) => {
  //     const originalRequest = error.config;
  //     console.log("!!! error.response.status : ", error.response.status);

  //     if (error.response.status === 401 && !originalRequest._retry) {
  //       originalRequest._retry = true;

  //       const data = await refreshToken(store);

  //       console.log("got new refreshToken, updating ... : ", data);
  //       const access_token = data.access_token;
  //       const access_token_expires_at = data.access_token_expires_at;

  //       // update the state and the local storage
  //       const session = getSessionFromLocalStorage();
  //       const newSession = {
  //         ...session,
  //         access_token,
  //         access_token_expires_at,
  //       };
  //       setSessionInLocalStorage(newSession);

  //       customFetch.defaults.headers.common[
  //         "Authorization"
  //       ] = `Bearer ${access_token}`;
  //       return customFetch(originalRequest);
  //     } else if (error.response.status === 403) {
  //       originalRequest._retry = false;
  //       // refresh token expired - logout the user
  //       store.dispatch(clearAdvertStore());
  //       store.dispatch(logout());
  //       history.push("/landing");
  //     }
  //     return Promise.reject(error);
  //   }
  // );
};

// const refreshToken = async () => {
//   try {
//     const session = getSessionFromLocalStorage();
//     const resp = await customFetch.post("/token/renew_access", {
//       refresh_token: session.refresh_token,
//     });
//     return resp.data;
//   } catch (error) {
//     console.log("refresh token expired ... redirecting user ");
//   }
// };
export default customFetch;
