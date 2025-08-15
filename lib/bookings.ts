import api from "../lib/api"; // axios instance

export const getMyBookings = async ({
  page,
  status,
  sort,
}: {
  page: number;
  status?: string;
  sort?: "asc" | "desc";
}) => {
  const res = await api.get("/facilities/bookings/my", {
    params: {
      page,
      limit: 10,
      status,
      sortBy: "createdAt",
      order: sort,
    },
  });
  return res.data;
};

export const cancelBooking = async (id: string) => {
  const res = await api.delete(`/facilities/bookings/${id}`);
  return res.data;
};
