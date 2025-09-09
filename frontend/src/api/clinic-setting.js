import api from "@/plugins/axios";

export const fetchClinicSetting = () => api.get("/clinic-setting/all");
