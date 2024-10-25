import apiSlice from "../api/apiSlice";

const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Define the new endpoint for fetching messages
    getMessages: builder.query({
      query: ({ senderId, recipientId }) => ({
        url: `chat/messages?sender=${senderId}&recipient=${recipientId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetMessagesQuery } = chatApi;
