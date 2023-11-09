import apiSlice from "../api/apiSlice";

const workStatusApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllLeaves: builder.query({
      query: () => ({
        url: `/leave-management`,
      }),
    }),
    // deleteProject: builder.mutation({
    //   query: (id) => ({
    //     method: "DELETE",
    //     url: `/projects/${id}`,
    //   }),
    //   invalidatesTags : ['projects']
    // }),
    addLeaveApply: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/leave-management",
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

export const { useAddLeaveApplyMutation , useGetAllLeavesQuery} = workStatusApi;
