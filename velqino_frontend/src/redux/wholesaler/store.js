import { configureStore } from '@reduxjs/toolkit';
// Change this import - import from wholesalerSlice.js, not from Api/wholesalerAPI.js
import { wholesalerApi } from '../wholesaler/slices/wholesalerSlice';  // or adjust path as needed
import { productsApi } from '../wholesaler/slices/productsSlice';

export const store = configureStore({
    reducer: {
        [wholesalerApi.reducerPath]: wholesalerApi.reducer,
        [productsApi.reducerPath]: productsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            wholesalerApi.middleware,
            productsApi.middleware,
        ),
});