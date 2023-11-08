import apiSlice from "../api/apiSlice";

const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // getProjects: builder.query({
    //   query: () => ({
    //     url: `/projects`,
    //   }),
    //   providesTags: ["projects"],
    // }),
    getProfileByEmail: builder.query({
      query: (email) => ({
        url: `/profile/${email}`,
      }),
    }),
    // deleteProject: builder.mutation({
    //   query: (id) => ({
    //     method: "DELETE",
    //     url: `/projects/${id}`,
    //   }),
    //   invalidatesTags : ['projects']
    // }),
    addProfile: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/profile",
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

export const { useAddProfileMutation , useGetProfileByEmailQuery } = profileApi;
