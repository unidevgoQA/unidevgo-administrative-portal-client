import apiSlice from "../api/apiSlice";

const leaveManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllLeaves: builder.query({
      query: () => ({
        url: `/leave-management`,
      }),
      providesTags: ["leaveManagement"],
    }),
    deleteLeave: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `/leave-management/${id}`,
      }),
      invalidatesTags : ['leaveManagement']
    }),
    addLeaveApply: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/leave-management",
        body: data,
      }),
        invalidatesTags : ['leaveManagement']
    }),
    leaveEmail: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/send-email/leave-email",
        body: data,
      }),
        invalidatesTags : ['leaveManagement']
    }),
    updateLeave: builder.mutation({
      query: ({id,data}) => ({
        method: "PUT",
        url: `/leave-management/${id}`,
        body: data,
      }),
      invalidatesTags: ["leaveManagement"],
    }),
  }),
});

export const {
  useAddLeaveApplyMutation,
  useGetAllLeavesQuery,
  useLeaveEmailMutation,
  useDeleteLeaveMutation,
  useUpdateLeaveMutation
} = leaveManagementApi;
