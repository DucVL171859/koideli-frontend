export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const REGISTER = 'REGISTER';

export const loginAction = (user, roles) => {
    sessionStorage.setItem('roles', roles);
    sessionStorage.setItem('username', user);
    return {
        type: LOGIN,
        payload: { user, roles }
    }
}

export const logoutAction = () => {
    sessionStorage.clear();
    return {
        type: LOGOUT
    }
}

export const registerAction = (user) => ({
    type: REGISTER,
    payload: { user }
});