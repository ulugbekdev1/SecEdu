export const setAuth = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
};

export const getRole = () => {
  return localStorage.getItem("role");
};

export const logout = () => {
  localStorage.clear();
};