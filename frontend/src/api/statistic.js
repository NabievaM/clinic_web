import api from "@/plugins/axios";

export function fetchStatistics() {
  return api.get("/statistics");
}
