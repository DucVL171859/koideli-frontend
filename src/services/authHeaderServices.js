const authHeader = () => {
  let token = sessionStorage.getItem("token"); // Token should already be a string

  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
};

export default authHeader;
