import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import retailerAPI from '../Api/retailerAPI';

export const retailerApi = createApi({
    reducerPath: 'retailerApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Retailer', 'Retailers'],
    endpoints: (builder) => ({
        // Register Retailer
        registerRetailer: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await retailerAPI.registerRetailer(data);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
        }),
        
        // Login Retailer
        loginRetailer: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await retailerAPI.loginRetailer(data);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
        }),
        
        // Get Retailer Profile
        getRetailerProfile: builder.query({
            async queryFn(userId) {
                try {
                    const response = await retailerAPI.getRetailerProfile(userId);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: (result, error, userId) => [{ type: 'Retailer', id: userId }]
        }),
        
        // Update Retailer Profile
        updateRetailerProfile: builder.mutation({
            async queryFn({ userId, data }) {
                try {
                    const response = await retailerAPI.updateRetailerProfile(userId, data);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: (result, error, { userId }) => [{ type: 'Retailer', id: userId }]
        }),
    })
});

export const {
    useRegisterRetailerMutation,
    useLoginRetailerMutation,
    useGetRetailerProfileQuery,
    useUpdateRetailerProfileMutation,
} = retailerApi;