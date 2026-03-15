import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import wholesalerAPI from '../Api/wholesalerAPI';

export const wholesalerApi = createApi({  // Keep as wholesalerApi
    reducerPath: 'wholesalerApi',
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({
        registerWholesaler: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await wholesalerAPI.register(data);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            }
        }),
        fetchProfile: builder.query({
            async queryFn(userId) {
                try {
                    const response = await wholesalerAPI.getProfile(userId);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            }
        }),
        updateProfile: builder.mutation({
            async queryFn({ userId, data }) {
                try {
                    const response = await wholesalerAPI.updateProfile(userId, data);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            }
        }),
        deleteProfile: builder.mutation({
            async queryFn(userId) {
                try {
                    await wholesalerAPI.deleteProfile(userId);
                    return { data: userId };
                } catch (error) {
                    return { error };
                }
            }
        }),
        fetchAllWholesalers: builder.query({
            async queryFn(params) {
                try {
                    const response = await wholesalerAPI.getAll(params);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            }
        })
    })
});

export const {
    useRegisterWholesalerMutation,
    useFetchProfileQuery,
    useUpdateProfileMutation,
    useDeleteProfileMutation,
    useFetchAllWholesalersQuery
} = wholesalerApi;