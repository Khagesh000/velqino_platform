import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import aiStudioAPI from '../Api/aiStudioAPI';

export const aiStudioApi = createApi({
  reducerPath: 'aiStudioApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['AIModels', 'TryOnSession', 'TryOnHistory'],

  endpoints: (builder) => ({
    // ========== GET AI MODELS ==========
    getAIModels: builder.query({
      async queryFn(params) {
        try {
          const response = await aiStudioAPI.getModels(params);
          return { data: response.data };
        } catch (error) {
          return { error: error.response?.data || error };
        }
      },
      providesTags: ['AIModels'],
    }),

    // ========== GET SINGLE MODEL ==========
    getAIModel: builder.query({
      async queryFn(slug) {
        try {
          const response = await aiStudioAPI.getModel(slug);
          return { data: response.data };
        } catch (error) {
          return { error: error.response?.data || error };
        }
      },
    }),

    // ========== GENERATE VIRTUAL TRY-ON ==========
    generateTryOn: builder.mutation({
      async queryFn(formData) {
        try {
          const response = await aiStudioAPI.generateTryOn(formData);
          return { data: response.data };
        } catch (error) {
          return { error: error.response?.data || error };
        }
      },
      invalidatesTags: ['TryOnHistory'],
    }),

    // ========== GET SESSION DETAIL ==========
    getTryOnSession: builder.query({
      async queryFn(sessionId) {
        try {
          const response = await aiStudioAPI.getSession(sessionId);
          return { data: response.data };
        } catch (error) {
          return { error: error.response?.data || error };
        }
      },
      providesTags: (result, error, sessionId) => [{ type: 'TryOnSession', id: sessionId }],
    }),

    // ========== GET HISTORY ==========
    getTryOnHistory: builder.query({
      async queryFn(sellerType) {
        try {
          const response = await aiStudioAPI.getHistory(sellerType);
          return { data: response.data };
        } catch (error) {
          return { error: error.response?.data || error };
        }
      },
      providesTags: ['TryOnHistory'],
    }),

    // ========== EXPORT TO PRODUCT ==========
    exportToProduct: builder.mutation({
      async queryFn(payload) {
        try {
          const response = await aiStudioAPI.exportToProduct(payload);
          return { data: response.data };
        } catch (error) {
          return { error: error.response?.data || error };
        }
      },
    }),

    // ========== GET CATALOG PRODUCTS FOR GARMENT TESTING ==========
    getCatalogProducts: builder.query({
      async queryFn(sellerType) {
        try {
          const response = await aiStudioAPI.getCatalogProducts(sellerType);
          const prods = response?.data?.results || response?.data?.products || (Array.isArray(response?.data) ? response.data : []);
          return { data: prods };
        } catch (error) {
          return { error: error.response?.data || error };
        }
      },
    }),
  }),
});

export const {
  useGetAIModelsQuery,
  useGetAIModelQuery,
  useGenerateTryOnMutation,
  useGetTryOnSessionQuery,
  useGetTryOnHistoryQuery,
  useExportToProductMutation,
  useGetCatalogProductsQuery,
} = aiStudioApi;

export default aiStudioApi;
