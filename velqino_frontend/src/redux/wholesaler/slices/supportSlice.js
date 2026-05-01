import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import supportAPI from '../Api/supportAPI';

export const supportApi = createApi({
    reducerPath: 'supportApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['FAQs', 'FAQCategories', 'Tickets', 'TicketCategories', 'TicketReplies', 'SystemStatus'],
    endpoints: (builder) => ({
        // Get all FAQs
        getFAQs: builder.query({
            async queryFn(params) {
                try {
                    const response = await supportAPI.getFAQs(params);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: ['FAQs']
        }),
        
        // Get FAQ categories
        getFAQCategories: builder.query({
            async queryFn() {
                try {
                    const response = await supportAPI.getFAQCategories();
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: ['FAQCategories']
        }),
        
        // Search FAQs
        searchFAQs: builder.query({
            async queryFn(query) {
                try {
                    const response = await supportAPI.searchFAQs(query);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: ['FAQs']
        }),
        
        // Mark FAQ as helpful
        markFAQHelpful: builder.mutation({
            async queryFn({ faqId, helpful }) {
                try {
                    const response = await supportAPI.markFAQHelpful(faqId, helpful);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['FAQs']
        }),
        
        // Increment FAQ view
        incrementFAQView: builder.mutation({
            async queryFn(faqId) {
                try {
                    const response = await supportAPI.incrementFAQView(faqId);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['FAQs']
        }),

        createTicket: builder.mutation({
            async queryFn(data) {
                try {
                    const response = await supportAPI.createTicket(data);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            invalidatesTags: ['Tickets']
        }),

        getTicketCategories: builder.query({
            async queryFn() {
                try {
                    const response = await supportAPI.getTicketCategories();
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: ['TicketCategories']
        }),

        uploadAttachment: builder.mutation({
            async queryFn(file) {
                try {
                    const response = await supportAPI.uploadAttachment(file);
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
        }),

                    // Add to endpoints
            getUserTickets: builder.query({
                async queryFn(params) {
                    try {
                        const response = await supportAPI.getUserTickets(params);
                        return { data: response.data };
                    } catch (error) {
                        return { error };
                    }
                },
                providesTags: ['Tickets']
            }),

            getTicketDetail: builder.query({
                async queryFn(ticketId) {
                    try {
                        const response = await supportAPI.getTicketDetail(ticketId);
                        return { data: response.data };
                    } catch (error) {
                        return { error };
                    }
                },
                providesTags: (result, error, ticketId) => [{ type: 'Ticket', id: ticketId }]
            }),

            getTicketReplies: builder.query({
                async queryFn(ticketId) {
                    try {
                        const response = await supportAPI.getTicketReplies(ticketId);
                        return { data: response.data };
                    } catch (error) {
                        return { error };
                    }
                },
                providesTags: (result, error, ticketId) => [{ type: 'TicketReplies', id: ticketId }]
            }),

            replyToTicket: builder.mutation({
                async queryFn({ ticketId, message }) {
                    try {
                        const response = await supportAPI.replyToTicket(ticketId, message);
                        return { data: response.data };
                    } catch (error) {
                        return { error };
                    }
                },
                invalidatesTags: ['Tickets', 'TicketReplies']
            }),

            closeTicket: builder.mutation({
                async queryFn(ticketId) {
                    try {
                        const response = await supportAPI.closeTicket(ticketId);
                        return { data: response.data };
                    } catch (error) {
                        return { error };
                    }
                },
                invalidatesTags: ['Tickets']
            }),

            getSystemStatus: builder.query({
            async queryFn() {
                try {
                    const response = await supportAPI.getSystemStatus();
                    return { data: response.data };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: ['SystemStatus']
        }),
    })
});

export const {
    useGetFAQsQuery,
    useGetFAQCategoriesQuery,
    useSearchFAQsQuery,
    useMarkFAQHelpfulMutation,
    useIncrementFAQViewMutation,
    useCreateTicketMutation,        
    useGetTicketCategoriesQuery,    
    useUploadAttachmentMutation,
    useGetUserTicketsQuery,        
    useGetTicketDetailQuery,        
    useGetTicketRepliesQuery,       
    useReplyToTicketMutation,       
    useCloseTicketMutation,
    useGetSystemStatusQuery,
} = supportApi;