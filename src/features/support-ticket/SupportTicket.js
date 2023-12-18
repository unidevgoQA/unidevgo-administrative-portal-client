import apiSlice from "../api/apiSlice";

const supportTicketsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTickets: builder.query({
      query: () => ({
        url: `/support-tickets`,
      }),
      providesTags: ["tickets"],
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
  }),
});

export const {useAddTicketMutation, useDeleteTicketMutation, useGetAllTicketsQuery} = supportTicketsApi;
