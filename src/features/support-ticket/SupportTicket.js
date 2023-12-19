import apiSlice from "../api/apiSlice";

const supportTicketsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTickets: builder.query({
      query: () => ({
        url: `/support-tickets`,
      }),
      providesTags: ["tickets"],
    }),
    getSingleTickets: builder.query({
      query: (id) => ({
        url: `/support-tickets/${id}`,
      }),
      invalidatesTags: ["tickets"],
    }),
    deleteTicket: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `/support-tickets/${id}`,
      }),
      invalidatesTags: ["tickets"],
    }),

    addTicket: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/support-tickets",
        body: data,
      }),
      invalidatesTags: ["tickets"],
    }),
    replyTicket: builder.mutation({
      query: (data,id) => ({
        method: "POST",
        url: `/support-tickets/reply/${id}`,
        body: data,
      }),
      invalidatesTags: ["tickets"],
    }),
  }),
});

export const {useAddTicketMutation, useDeleteTicketMutation, useGetAllTicketsQuery , useGetSingleTicketsQuery , useReplyTicketMutation} = supportTicketsApi;
