import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import retailerLoyaltyAPI from '../Api/retailerLoyaltyAPI';

export const retailerLoyaltyApi = createApi({
    reducerPath: 'retailerLoyaltyApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['LoyaltySettings', 'PointsTransactions', 'Rewards', 'Campaigns', 'Members'],
    endpoints: (builder) => ({

        // ========== LOYALTY SETTINGS ==========
        getLoyaltySettings: builder.query({
            async queryFn() {
                try {
                    const response = await retailerLoyaltyAPI.getLoyaltySettings();
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: ['LoyaltySettings']
        }),

        updateLoyaltySettings: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await retailerLoyaltyAPI.updateLoyaltySettings(data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: ['LoyaltySettings']
        }),

        // ========== POINTS TRANSACTIONS ==========
        getPointsTransactions: builder.query({
            async queryFn(params) {
                try {
                    const response = await retailerLoyaltyAPI.getPointsTransactions(params);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: ['PointsTransactions']
        }),

        getPointsSummary: builder.query({
            async queryFn(customerId) {
                try {
                    const response = await retailerLoyaltyAPI.getPointsSummary(customerId);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: ['PointsTransactions']
        }),

        redeemPoints: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await retailerLoyaltyAPI.redeemPoints(data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: ['PointsTransactions']
        }),

        // ========== REWARDS CATALOG ==========
        getRewards: builder.query({
            async queryFn(params) {
                try {
                    const response = await retailerLoyaltyAPI.getRewards(params);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: ['Rewards']
        }),

        getRewardDetail: builder.query({
            async queryFn(rewardId) {
                try {
                    const response = await retailerLoyaltyAPI.getRewardDetail(rewardId);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: (result, error, rewardId) => [{ type: 'Rewards', id: rewardId }]
        }),

        createReward: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await retailerLoyaltyAPI.createReward(data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: ['Rewards']
        }),

        updateReward: builder.mutation({
            async queryFn({ rewardId, data }) {
                try {
                    const response = await retailerLoyaltyAPI.updateReward(rewardId, data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: (result, error, { rewardId }) => [{ type: 'Rewards', id: rewardId }]
        }),

        deleteReward: builder.mutation({
            async queryFn(rewardId) {
                try {
                    const response = await retailerLoyaltyAPI.deleteReward(rewardId);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: ['Rewards']
        }),

        // ========== CAMPAIGNS ==========
        getCampaigns: builder.query({
            async queryFn(params) {
                try {
                    const response = await retailerLoyaltyAPI.getCampaigns(params);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: ['Campaigns']
        }),

        getCampaignDetail: builder.query({
            async queryFn(campaignId) {
                try {
                    const response = await retailerLoyaltyAPI.getCampaignDetail(campaignId);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: (result, error, campaignId) => [{ type: 'Campaigns', id: campaignId }]
        }),

        createCampaign: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await retailerLoyaltyAPI.createCampaign(data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: ['Campaigns']
        }),

        updateCampaign: builder.mutation({
            async queryFn({ campaignId, data }) {
                try {
                    const response = await retailerLoyaltyAPI.updateCampaign(campaignId, data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: (result, error, { campaignId }) => [{ type: 'Campaigns', id: campaignId }]
        }),

        deleteCampaign: builder.mutation({
            async queryFn(campaignId) {
                try {
                    const response = await retailerLoyaltyAPI.deleteCampaign(campaignId);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: ['Campaigns']
        }),

        applyCampaignBonus: builder.mutation({
            async queryFn({ campaignId, data }) {
                try {
                    const response = await retailerLoyaltyAPI.applyCampaignBonus(campaignId, data);
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            invalidatesTags: ['Campaigns', 'PointsTransactions']
        }),

        // ========== MEMBER LIST (from existing endpoints) ==========
        getCustomersList: builder.query({
            async queryFn() {
                try {
                    const response = await retailerLoyaltyAPI.getCustomersList();
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: ['Members']
        }),

        getRetailerCustomers: builder.query({
            async queryFn() {
                try {
                    const response = await retailerLoyaltyAPI.getRetailerCustomers();
                    return { data: response.data };
                } catch (error) {
                    return { error: error.response?.data || error };
                }
            },
            providesTags: ['Members']
        }),
    }),
});

// Export hooks
export const {
    // Loyalty Settings
    useGetLoyaltySettingsQuery,
    useUpdateLoyaltySettingsMutation,
    // Points Transactions
    useGetPointsTransactionsQuery,
    useGetPointsSummaryQuery,
    useRedeemPointsMutation,
    // Rewards
    useGetRewardsQuery,
    useGetRewardDetailQuery,
    useCreateRewardMutation,
    useUpdateRewardMutation,
    useDeleteRewardMutation,
    // Campaigns
    useGetCampaignsQuery,
    useGetCampaignDetailQuery,
    useCreateCampaignMutation,
    useUpdateCampaignMutation,
    useDeleteCampaignMutation,
    useApplyCampaignBonusMutation,
    // Members
    useGetCustomersListQuery,
    useGetRetailerCustomersQuery,
} = retailerLoyaltyApi;