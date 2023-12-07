import apiSlice from "../api/apiSlice";

const attendenceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllAttendence: builder.query({
      query: () => ({
        url: `/attendence`,
      }),
      providesTags: ["attendence"],
    }),
    deleteAttendence: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `/attendence/${id}`,
      }),
      invalidatesTags: ["attendence"],
    }),

    addAttendence: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/attendence",
        body: data,
      }),
      invalidatesTags: ["attendence"],
    }),
  }),
});

export const {useAddAttendenceMutation,useDeleteAttendenceMutation,useGetAllAttendenceQuery} = attendenceApi;
