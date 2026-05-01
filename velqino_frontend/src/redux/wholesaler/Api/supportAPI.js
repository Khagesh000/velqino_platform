import API from '../../../utils/apiConfig';

const supportAPI = {
    // FAQ endpoints
    getFAQs: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `realtime_hub/faqs/?${queryString}` : 'realtime_hub/faqs/';
        return API.get(url);
    },
    
    getFAQCategories: () => API.get('realtime_hub/faqs/categories/'),
    
    searchFAQs: (query) => API.get(`realtime_hub/faqs/search/?q=${encodeURIComponent(query)}`),
    
    markFAQHelpful: (faqId, helpful = true) => 
        API.post(`realtime_hub/faqs/${faqId}/helpful/`, { helpful }),
    
    incrementFAQView: (faqId) => 
        API.post(`realtime_hub/faqs/${faqId}/view/`),

    createTicket: (data) => API.post('realtime_hub/tickets/', data),
        getTicketCategories: () => API.get('realtime_hub/tickets/categories/'),
        uploadAttachment: (file) => {
            const formData = new FormData();
            formData.append('file', file);
            return API.post('realtime_hub/tickets/attachments/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
    },

    getUserTickets: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `realtime_hub/tickets/my-tickets/?${queryString}` : 'realtime_hub/tickets/my-tickets/';
    return API.get(url);
    },

    getTicketDetail: (ticketId) => API.get(`realtime_hub/tickets/${ticketId}/`),

    getTicketReplies: (ticketId) => API.get(`realtime_hub/tickets/${ticketId}/replies/`),

    replyToTicket: (ticketId, message) => API.post(`realtime_hub/tickets/${ticketId}/reply/`, { message }),

    closeTicket: (ticketId) => API.post(`realtime_hub/tickets/${ticketId}/close/`),

    getSystemStatus: () => API.get('realtime_hub/system/status/'),

};

export default supportAPI;