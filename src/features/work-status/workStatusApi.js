import apiSlice from "../api/apiSlice";

const workStatusApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWorkTasks: builder.query({
      query: () => ({
        url: `/work-status`,
      }),
    }),
    deleteWorkTask: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `/work-status/${id}`,
      }),
      // invalidatesTags : ['work-status']
    }),
    addWorkTask: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/work-status",
        body: data,
      }),
      //   invalidatesTags : ['work-status']
    }),
    updateWorkTask: builder.mutation({
      query: ({ id, data }) => ({
        method: "PUT",
        url: `/work-status/${id}`,
        body: data,
      }),
      // invalidatesTags: ["work-status"],
    }),
  }),
});

export const {
  useAddWorkTaskMutation,
  useGetWorkTasksQuery,
  useGetworkStatusByEmailQuery,
  useDeleteWorkTaskMutation,
  useUpdateWorkTaskMutation,
} = workStatusApi;
