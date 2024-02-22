import apiSlice from "../api/apiSlice";

const appointmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    appointmentConfirmationEmail: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/appointment-confirmation-email",
        body: data,
      }),
      // invalidatesTags : ['']
    }),
  }),
});
export const { useAppointmentConfirmationEmailMutation } = appointmentApi;
