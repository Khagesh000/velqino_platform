import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import homepageAPI from '../Api/homepageAPI';

export const homepageApi = createApi({
    reducerPath: 'homepageApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Homepage'],
    endpoints: (builder) => ({
        // Get homepage data
        getHomepageData: builder.query({
            async queryFn() {
                try {
                    const response = await homepageAPI.getHomepageData();
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: ['Homepage']
        }),
    })
});

export const {
    useGetHomepageDataQuery,
} = homepageApi;