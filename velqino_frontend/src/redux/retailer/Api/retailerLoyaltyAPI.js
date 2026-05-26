import API from "@/utils/apiConfig";

const retailerLoyaltyAPI = {
    // ========== LOYALTY SETTINGS ==========
    getLoyaltySettings: () => API.get('commerce/loyalty-settings/'),
    updateLoyaltySettings: (data) => API.put('commerce/loyalty-settings/', data),

    // ========== POINTS TRANSACTIONS ==========
    getPointsTransactions: (params) => API.get('commerce/points/transactions/', { params }),
    getPointsSummary: (customerId) => API.get(`commerce/points/summary/?customer_id=${customerId}`),
    redeemPoints: (data) => API.post('commerce/points/redeem/', data),

    // ========== REWARDS CATALOG ==========
    getRewards: (params) => API.get('commerce/rewards/', { params }),
    getRewardDetail: (rewardId) => API.get(`commerce/rewards/${rewardId}/`),
    createReward: (data) => API.post('commerce/rewards/create/', data),
    updateReward: (rewardId, data) => API.put(`commerce/rewards/${rewardId}/update/`, data),
    deleteReward: (rewardId) => API.delete(`commerce/rewards/${rewardId}/delete/`),

    // ========== CAMPAIGNS ==========
    getCampaigns: (params) => API.get('commerce/campaigns/', { params }),
    getCampaignDetail: (campaignId) => API.get(`commerce/campaigns/${campaignId}/`),
    createCampaign: (data) => API.post('commerce/campaigns/create/', data),
    updateCampaign: (campaignId, data) => API.put(`commerce/campaigns/${campaignId}/update/`, data),
    deleteCampaign: (campaignId) => API.delete(`commerce/campaigns/${campaignId}/delete/`),
    applyCampaignBonus: (campaignId, data) => API.post(`commerce/campaigns/${campaignId}/apply/`, data),

    // ========== MEMBER LIST (from existing endpoints) ==========
    getCustomersList: () => API.get('identity/customers/list/'),
    getRetailerCustomers: () => API.get('commerce/retailer/customers/'),
};

export default retailerLoyaltyAPI;