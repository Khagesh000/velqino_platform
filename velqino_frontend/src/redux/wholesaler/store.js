import { configureStore } from '@reduxjs/toolkit';
import { wholesalerApi } from '../wholesaler/slices/wholesalerSlice';
import { productsApi } from '../wholesaler/slices/productsSlice';
import { categoriesApi } from './slices/categoriesSlice';
import { ordersApi } from './slices/ordersSlice';
import { cartApi } from './slices/cartSlice';  
import { customerApi } from '../customer/slices/customerSlice';
import { retailerApi } from '../retailer/slices/retailerSlice';

export const store = configureStore({
    reducer: {
        [wholesalerApi.reducerPath]: wholesalerApi.reducer,
        [productsApi.reducerPath]: productsApi.reducer,
        [categoriesApi.reducerPath]: categoriesApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
        [ordersApi.reducerPath]:ordersApi.reducer,
        [customerApi.reducerPath]:customerApi.reducer,
        [retailerApi.reducerPath]:retailerApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            wholesalerApi.middleware,
            productsApi.middleware,
            categoriesApi.middleware,
            cartApi.middleware,
            ordersApi.middleware,
            customerApi.middleware,
            retailerApi.middleware,
        ),
});