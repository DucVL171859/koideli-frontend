import { REGISTER, LOGIN, LOGOUT } from './actions';

export const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    currentUser: '',
    newUser: {},
    roles: []
};

const auth = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER: {
            const { user } = action.payload;
            return {
                ...state,
                isLoggedIn: true,
                newUser: user,
                currentUser: user.username
            };
        }
        case LOGIN: {
            const { user, roles } = action.payload;
            return {
                ...state,
                isLoggedIn: true,
                isInitialized: true,
                currentUser: user,
                roles: roles
            };
        }
        case LOGOUT: {
            return {
                ...state,
                isInitialized: true,
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default auth;
