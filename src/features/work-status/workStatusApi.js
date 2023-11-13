import apiSlice from "../api/apiSlice";

const workStatusApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWorkTasks: builder.query({
      query: () => ({
        url: `/work-status`,
      }),
      providesTags: ["workStatus"],
    }),
    deleteWorkTask: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `/work-status/${id}`,
      }),
      invalidatesTags : ['workStatus']
    }),
    addWorkTask: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/work-status",
        body: data,
      }),
      invalidatesTags : ['workStatus']
    }),
    updateWorkTask: builder.mutation({
      query: ({ id, data }) => ({
        method: "PUT",
        url: `/work-status/${id}`,
        body: data,
      }),
      invalidatesTags : ['workStatus']
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
