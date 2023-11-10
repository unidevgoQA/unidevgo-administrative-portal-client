import apiSlice from "../api/apiSlice";

const leaveManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllLeaves: builder.query({
      query: () => ({
        url: `/leave-management`,
      }),
    }),
    deleteLeave: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `/leave-management/${id}`,
      }),
    }),
    addLeaveApply: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/leave-management",
        body: data,
      }),
      //   invalidatesTags : ['leave-management']
    }),
    // updateLeave: builder.mutation({
    //   query: ({id,data}) => ({
    //     method: "PUT",
    //     url: `/leave-management/${id}`,
    //     body: data,
    //   }),
    //   invalidatesTags: ["leave-management"],
    // }),
  }),
});

export const {
  useAddLeaveApplyMutation,
  useGetAllLeavesQuery,
  useDeleteLeaveMutation,
} = leaveManagementApi;
