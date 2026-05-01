import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import retailerAPI from '../Api/retailerAPI';

export const retailerApi = createApi({
    reducerPath: 'retailerApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Retailer', 'Retailers'],
    endpoints: (builder) => ({
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

        // ✅ FIXED - This is the correct version
        listRetailers: builder.query({
            async queryFn(params) {
                try {
                    console.log('📤 retailerSlice.listRetailers called with params:', params);
                    const response = await retailerAPI.listRetailers(params || {});
                    return { data: response.data };
                } catch (error) {
                    console.error('❌ Error in listRetailers:', error);
                    return { error };
                }
            },
            providesTags: ['Retailers']
        }),

        blockRetailer: builder.mutation({
            async queryFn(userId) {
                try {
                    const response = await retailerAPI.blockRetailer(userId);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Retailers']
        }),

        unblockRetailer: builder.mutation({
            async queryFn(userId) {
                try {
                    const response = await retailerAPI.unblockRetailer(userId);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Retailers']
        }),
    })
});

export const {
    useRegisterRetailerMutation,
    useLoginRetailerMutation,
    useGetRetailerProfileQuery,
    useUpdateRetailerProfileMutation,
    useListRetailersQuery,
    useBlockRetailerMutation,
    useUnblockRetailerMutation,
} = retailerApi;