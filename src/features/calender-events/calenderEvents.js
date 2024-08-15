import apiSlice from "../api/apiSlice";

const calenderEventsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllEvents: builder.query({
      query: () => ({
        url: `/calender-events`,
      }),
      providesTags: ["calender-event"],
    }),
    deleteCalenderEvent: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `/calender-events/${id}`,
      }),
      invalidatesTags: ["calender-event"],
    }),

    addCalenderEvent: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/calender-events",
        body: data, 
      }),
      invalidatesTags: ["calender-event"],
    }),
    eventEmail: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/event-email",
        body: data,
      }),
      // invalidatesTags : ['']
    }),
  }),
});

export const {useAddCalenderEventMutation,useDeleteCalenderEventMutation,useGetAllEventsQuery,useEventEmailMutation} = calenderEventsApi;
