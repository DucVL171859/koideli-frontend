const authHeader = () => {
  let token = sessionStorage.getItem("token");

  if (token) {
    console.log(token)
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
};

export default authHeader;
