// redux/wholesaler/slices/categoriesSlice.js
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import categoriesAPI from '../Api/categoriesAPI';

export const categoriesApi = createApi({
    reducerPath: 'categoriesApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Categories', 'Category'],
    endpoints: (builder) => ({
        // Get all categories
        getCategories: builder.query({
            async queryFn() {
                try {
                    const response = await categoriesAPI.getCategories();
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: ['Categories']
        }),
        
        // Get single category
        getCategory: builder.query({
            async queryFn(categoryId) {
                try {
                    const response = await categoriesAPI.getCategory(categoryId);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: (result, error, id) => [{ type: 'Category', id }]
        }),
        
        // Create category
        createCategory: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await categoriesAPI.createCategory(data);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Categories']
        }),
        
        // Update category
        updateCategory: builder.mutation({
            async queryFn({ id, data }) {
                try {
                    const response = await categoriesAPI.updateCategory(id, data);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: (result, error, { id }) => [
                'Categories',
                { type: 'Category', id }
            ]
        }),
        
        // Delete category
        deleteCategory: builder.mutation({
            async queryFn(id) {
                try {
                    await categoriesAPI.deleteCategory(id);
                    return { data: id };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Categories']
        }),
        
        // Reorder categories (drag-drop)
        reorderCategories: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await categoriesAPI.reorderCategories(data);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Categories']
        }),
    })
});

// Export all hooks
export const {
    useGetCategoriesQuery,
    useGetCategoryQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useReorderCategoriesMutation,
} = categoriesApi;

// Default export for the reducer
export default categoriesApi.reducer;