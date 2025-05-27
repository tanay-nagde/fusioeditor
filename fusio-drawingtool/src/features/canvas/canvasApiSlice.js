import { apiSlice } from "../api/apiSlice";

export const canvasApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCanvas: builder.mutation({
      query: (body) => ({
        url: "/canvas/create",
        method: "POST",
        body,
      }),
    }),
    getCanvasById: builder.query({
      query: (canvasId) => `/canvas/${canvasId}`,
    }),
    getUserCanvases: builder.query({
      query: () => "/canvas/user", // Adjust the endpoint as per your backend
    }),
    deleteCanvas: builder.mutation({
      query: (canvasId) => ({
        url: `/canvas/${canvasId}`,
        method: "DELETE",
      }),
    }),
    saveCanvasData: builder.mutation({
      query: ({ canvasId, data }) => ({
        url: `/canvas/${canvasId}/save`,
        method: "POST",
        body: { data },
      }),
    }),
  }),
});

export const {
  useCreateCanvasMutation,
  useGetCanvasByIdQuery,
  useSaveCanvasDataMutation,
  useGetUserCanvasesQuery,
  useDeleteCanvasMutation,
} = canvasApi;
