// store.js
import { createStore } from 'redux';

const initialState = {
  socket: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SOCKET':
      return {
        ...state,
        socket: action.payload,
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
