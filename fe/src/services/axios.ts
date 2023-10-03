import axios from "axios";

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  timeout: 60000,
});

const signOut = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('roleName')
  window.location.href = `${window.location.origin}/login`
}

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    console.log({24: error});
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    const originalRequest = error.config;
    console.log({37: error});
    if (error.response.status === 401) {
      signOut()
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // handle refresh token
    }
    // return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  if (token) {
    //applying token
    instance.defaults.headers.common["Authorization"] = token;
  } else {
    //deleting the token from header
    delete instance.defaults.headers.common["Authorization"];
  }
};

export default instance;
