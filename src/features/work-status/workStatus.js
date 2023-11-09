import apiSlice from "../api/apiSlice";

const workStatusApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWorkTasks: builder.query({
      query: () => ({
        url: `/work-status`,
      }),
    }),
    // deleteProject: builder.mutation({
    //   query: (id) => ({
    //     method: "DELETE",
    //     url: `/projects/${id}`,
    //   }),
    //   invalidatesTags : ['projects']
    // }),
    addWorkTask: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/work-status",
        body: data,
      }),
      //   invalidatesTags : ['projects']
    }),
    // updateProject: builder.mutation({
    //   query: ({id,data}) => ({
    //     method: "PUT",
    //     url: `/projects/${id}`,
    //     body: data,
    //   }),
    //   invalidatesTags: ["projects"],
    // }),
  }),
});

export const { useAddWorkTaskMutation , useGetWorkTasksQuery, useGetworkStatusByEmailQuery} = workStatusApi;
