import AsyncStorage from '@react-native-async-storage/async-storage';

let initialState = {
  token: '',
  isAuthenticated: false,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'user/set':
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
      };

    case 'user/logout':
      console.log('kogout');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
      };

    case 'user/update':
      return {
        ...state,
        user: action.payload.user,
      };

    default:
      return state;
  }
}
