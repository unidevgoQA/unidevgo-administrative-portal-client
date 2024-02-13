import apiSlice from "../api/apiSlice";

const leaveEmailApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllEmail: builder.query({
      query: () => ({
        url: `/email-list`,
      }),
      providesTags: ["leave-email"],
    }),
    deleteLeaveEmail: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `/email-list/${id}`,
      }),
      invalidatesTags : ['leave-email']
    }),
    addLeaveEmail: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/email-list",
        body: data,
      }),
        invalidatesTags : ['leave-email']
    }),   
  }),
});

export const {
    useGetAllEmailQuery,
    useAddLeaveEmailMutation,
    useDeleteLeaveEmailMutation
} = leaveEmailApi;
