import { configureStore } from '@reduxjs/toolkit';
// Change this import - import from wholesalerSlice.js, not from Api/wholesalerAPI.js
import { wholesalerApi } from '../wholesaler/slices/wholesalerSlice';  // or adjust path as needed

export const store = configureStore({
    reducer: {
        [wholesalerApi.reducerPath]: wholesalerApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(wholesalerApi.middleware),
});