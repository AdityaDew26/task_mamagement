import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from '../Notifications/notification';
// import other reducers as needed

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    // other reducers
  }
});

export default store;
