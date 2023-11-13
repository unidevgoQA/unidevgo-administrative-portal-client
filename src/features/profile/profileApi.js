import apiSlice from "../api/apiSlice";

const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfiles: builder.query({
      query: () => ({
        url: `/profile`,
      }),
      providesTags: ["profile"],
    }),
    getProfileByEmail: builder.query({
      query: (email) => ({
        url: `/profile/user/${email}`,
      }),
    }),
    deleteProfile: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `/profile/${id}`,
      }),
      invalidatesTags : ['profile']
    }),
    addProfile: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/profile",
        body: data,
      }),
      invalidatesTags : ['profile']
    }),
    // updateProfile: builder.mutation({
    //   query: ({id,data}) => ({
    //     method: "PUT",
    //     url: `/profile/${id}`,
    //     body: data,
    //   }),
    //   invalidatesTags: ["profile"],
    // }),
  }),
});

export const {
  useAddProfileMutation,
  useGetProfileByEmailQuery,
  useGetProfilesQuery,
  useDeleteProfileMutation,
} = profileApi;
