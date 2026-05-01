import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import customerAPI from '../Api/customerAPI';

export const customerApi = createApi({
    reducerPath: 'customerApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Customer', 'Profile'],
    endpoints: (builder) => ({
        // Register Customer
        registerCustomer: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await customerAPI.registerCustomer(data);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
        }),
        
        // Login Customer
        loginCustomer: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await customerAPI.loginCustomer(data);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
        }),
        
        // Get Customer Profile
        getCustomerProfile: builder.query({
            async queryFn(userId) {
                try {
                    const response = await customerAPI.getCustomerProfile(userId);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: (result, error, userId) => [{ type: 'Customer', id: userId }]
        }),
        
        // Update Customer Profile
        updateCustomerProfile: builder.mutation({
            async queryFn({ userId, data }) {
                try {
                    const response = await customerAPI.updateCustomerProfile(userId, data);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: (result, error, { userId }) => [{ type: 'Customer', id: userId }]
        }),

                    // Add merge cart mutation
            mergeCart: builder.mutation({
                async queryFn(sessionId) {
                    try {
                        const response = await customerAPI.mergeCart(sessionId);
                        return { data: response.data };
                    } catch (error) {
                        return { error };
                    }
                },
            }),

            changePassword: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await customerAPI.changePassword(data);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
        }),

                getProfile: builder.query({
            async queryFn({ userId, userRole }) {
                try {
                    const response = await customerAPI.getProfile(userId, userRole);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: ['Profile'],  // ✅ This requires 'Profile' in tagTypes
        }),
        
        updateProfile: builder.mutation({
            async queryFn({ userId, userRole, data }) {
                try {
                    const response = await customerAPI.updateProfile(userId, userRole, data);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Profile']
        }),

    })
});

export const {
    useRegisterCustomerMutation,
    useLoginCustomerMutation,
    useGetCustomerProfileQuery,
    useUpdateCustomerProfileMutation,
    useMergeCartMutation,
    useChangePasswordMutation,
    useGetProfileQuery,        
    useUpdateProfileMutation,
} = customerApi;