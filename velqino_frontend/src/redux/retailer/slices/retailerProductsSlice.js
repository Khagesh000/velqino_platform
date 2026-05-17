import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import retailerProductsAPI from '../Api/retailerProductsAPI';

export const retailerProductsApi = createApi({
    reducerPath: 'retailerProductsApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['RetailerProducts', 'RetailerProduct'],
    
    endpoints: (builder) => ({
        // ========== SINGLE PRODUCT ==========
        getRetailerProducts: builder.query({
            async queryFn(params) {
                try {
                    const response = await retailerProductsAPI.getProducts(params);
                    // ✅ API returns { products: [], pagination: {} } directly
                    // No need to wrap in data.data
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: (result) => 
                result?.products  // ✅ Change from result?.data?.products
                    ? [...result.products.map(p => ({ type: 'RetailerProducts', id: p.id })), { type: 'RetailerProducts', id: 'LIST' }]
                    : [{ type: 'RetailerProducts', id: 'LIST' }],
        }),
        
        getRetailerProduct: builder.query({
            async queryFn(productId) {
                try {
                    const response = await retailerProductsAPI.getProduct(productId);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: (result, error, productId) => [{ type: 'RetailerProduct', id: productId }],
        }),
        
        createRetailerProduct: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await retailerProductsAPI.createProduct(data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: [{ type: 'RetailerProducts', id: 'LIST' }],
        }),
        
        updateRetailerProduct: builder.mutation({
            async queryFn({ productId, data }) {
                try {
                    const response = await retailerProductsAPI.updateProduct(productId, data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: (result, error, { productId }) => [
                { type: 'RetailerProducts', id: 'LIST' },
                { type: 'RetailerProduct', id: productId },
            ],
        }),
        
        deleteRetailerProduct: builder.mutation({
            async queryFn(productId) {
                try {
                    const response = await retailerProductsAPI.deleteProduct(productId);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: [{ type: 'RetailerProducts', id: 'LIST' }],
        }),
        
        // ========== BULK IMAGES ==========
        bulkImagesSame: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await retailerProductsAPI.bulkImagesSame(data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: [{ type: 'RetailerProducts', id: 'LIST' }],
        }),
        
        bulkImagesDifferent: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await retailerProductsAPI.bulkImagesDifferent(data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: [{ type: 'RetailerProducts', id: 'LIST' }],
        }),
        
        getBulkStatus: builder.query({
            async queryFn(taskId) {
                try {
                    const response = await retailerProductsAPI.getBulkStatus(taskId);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
        }),
        
        // ========== BULK VIDEO ==========
        bulkVideo: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await retailerProductsAPI.bulkVideo(data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: [{ type: 'RetailerProducts', id: 'LIST' }],
        }),
        
        getVideoStatus: builder.query({
            async queryFn(taskId) {
                try {
                    const response = await retailerProductsAPI.getVideoStatus(taskId);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
        }),
        
        // ========== BULK EDIT & DELETE ==========
        bulkEditProducts: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await retailerProductsAPI.bulkEdit(data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: [{ type: 'RetailerProducts', id: 'LIST' }],
        }),
        
        bulkDeleteProducts: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await retailerProductsAPI.bulkDelete(data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: [{ type: 'RetailerProducts', id: 'LIST' }],
        }),
        importProducts: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await retailerProductsAPI.importProducts(data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: [{ type: 'RetailerProducts', id: 'LIST' }],
        }),

        // In retailerProductsSlice.js
        exportProducts: builder.mutation({
            async queryFn(params) {
                try {
                    const response = await retailerProductsAPI.exportProducts(params);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
        }),

    }),
});

// Export hooks
export const {
    useGetRetailerProductsQuery,
    useGetRetailerProductQuery,
    useCreateRetailerProductMutation,
    useUpdateRetailerProductMutation,
    useDeleteRetailerProductMutation,
    useBulkImagesSameMutation,
    useBulkImagesDifferentMutation,
    useGetBulkStatusQuery,
    useBulkVideoMutation,
    useGetVideoStatusQuery,
    useBulkEditProductsMutation,
    useBulkDeleteProductsMutation,
    useImportProductsMutation,
    useExportProductsMutation,
} = retailerProductsApi;