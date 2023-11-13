import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const apiSlice = createApi({
    reducerPath:'api',
    baseQuery: fetchBaseQuery({
        baseUrl : import.meta.env.VITE_BASE_URL,
    }),
    tagTypes:["leaveManagement" , "profile","workStatus"],
    endpoints : (builder) =>({})

})

export default apiSlice;