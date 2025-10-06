import api from "@/plugins/axios";

export function fetchStatistics() {
  return api.get("/statistics");
}

export const getStatisticsByDate = (date) => {
  return api.get(`/statistics/${date}`);
};
