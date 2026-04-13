import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import productsAPI from '../Api/productsAPI';

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Products', 'Product', 'Categories'],
    endpoints: (builder) => ({
        // Product CRUD
        getProducts: builder.query({
            async queryFn(params) {
                try {
                    const response = await productsAPI.getProducts(params);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: ['Products']
        }),
        
        getProduct: builder.query({
            async queryFn(productId) {
                try {
                    const response = await productsAPI.getProduct(productId);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: (result, error, id) => [{ type: 'Product', id }]
        }),
        
        createProduct: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await productsAPI.createProduct(data);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Products']
        }),
        
        updateProduct: builder.mutation({
            async queryFn({ productId, data }) {
                try {
                    const response = await productsAPI.updateProduct(productId, data);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: (result, error, { productId }) => [
                'Products',
                { type: 'Product', id: productId }
            ]
        }),
        
        deleteProduct: builder.mutation({
            async queryFn(productId) {
                try {
                    await productsAPI.deleteProduct(productId);
                    return { data: productId };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Products']
        }),
        
        // Special endpoints
        getLowStockProducts: builder.query({
            async queryFn() {
                try {
                    const response = await productsAPI.getLowStockProducts();
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: ['Products']
        }),
        
        bulkAction: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await productsAPI.bulkAction(data);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Products']
        }),
        
        
        // Add this inside endpoints (builder)
aiCreateProduct: builder.mutation({
  async queryFn(formData) {
    try {
      const response = await productsAPI.aiCreate(formData);
      return { data: response.data };
    } catch (error) {
      return { error };
    }
  },
  invalidatesTags: ['Products']
}),
    })
});

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetLowStockProductsQuery,
    useBulkActionMutation,
    useAiCreateProductMutation,
} = productsApi;