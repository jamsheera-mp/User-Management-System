

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types (file uploads can cause serialization issues)
        ignoredActions: ['auth/uploadProfilePicture/pending'],
      },
    }),
});

export default store;