import { configureStore } from '@reduxjs/toolkit';
import { wholesalerApi } from '../wholesaler/slices/wholesalerSlice';
import { productsApi } from '../wholesaler/slices/productsSlice';
import { categoriesApi } from './slices/categoriesSlice';
import { ordersApi } from './slices/ordersSlice';
import { cartApi } from './slices/cartSlice';  
import { customerApi } from '../customer/slices/customerSlice';
import { homepageApi } from './slices/homepageSlice';

import { retailerApi } from '../retailer/slices/retailerSlice';
import { retailerProductsApi } from '../retailer/slices/retailerProductsSlice';
import { retailerStatsApi } from '../retailer/slices/statsSlice';
import { retailerOrdersApi } from '../retailer/slices/retailerOrdersSlice';
import { retailerLoyaltyApi } from '../retailer/slices/retailerLoyaltySlice';
import { retailerReportsApi } from '../retailer/slices/retailerReportsSlice';

import { reviewsApi } from '../customer/slices/reviewsSlice';

import { wishlistApi } from './slices/wishlistSlice';
import { statsApi } from './slices/statsSlice';
import { supportApi } from './slices/supportSlice';

export const store = configureStore({
    reducer: {
        [wholesalerApi.reducerPath]: wholesalerApi.reducer,
        [productsApi.reducerPath]: productsApi.reducer,
        [categoriesApi.reducerPath]: categoriesApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
        [ordersApi.reducerPath]:ordersApi.reducer,
        [customerApi.reducerPath]:customerApi.reducer,

        [homepageApi.reducerPath]: homepageApi.reducer,

        [retailerApi.reducerPath]:retailerApi.reducer,
        [retailerProductsApi.reducerPath]:retailerProductsApi.reducer,
        [retailerStatsApi.reducerPath]:retailerStatsApi.reducer,
        [retailerOrdersApi.reducerPath]:retailerOrdersApi.reducer,
        [retailerLoyaltyApi.reducerPath]:retailerLoyaltyApi.reducer,
        [retailerReportsApi.reducerPath]:retailerReportsApi.reducer,

        [reviewsApi.reducerPath]:reviewsApi.reducer,


        [wishlistApi.reducerPath]:wishlistApi.reducer,
        [statsApi.reducerPath]:statsApi.reducer,
        [supportApi.reducerPath]:supportApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            wholesalerApi.middleware,
            productsApi.middleware,
            categoriesApi.middleware,
            cartApi.middleware,
            ordersApi.middleware,
            customerApi.middleware,
            homepageApi.middleware,

            retailerApi.middleware,
            retailerProductsApi.middleware,
            retailerStatsApi.middleware,
            retailerOrdersApi.middleware,
            retailerLoyaltyApi.middleware,
            retailerReportsApi.middleware,

            reviewsApi.middleware,
            
            wishlistApi.middleware,
            statsApi.middleware,
            supportApi.middleware,
        ),
});