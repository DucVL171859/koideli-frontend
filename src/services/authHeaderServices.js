const authHeader = () => {
    let user = sessionStorage.getItem("currentUser");
    let token = JSON.parse(sessionStorage.getItem("token"));

    if (user && token) {
        return { Authorization: `Bearer ${token}` };
    } else {
        return {};
    }
}

export default authHeader;