import api from "./api";

export const itemDistributionAPI = {
    getAll: (id) => api.get("/raffles/${id}/distributions"),
    manualStore: (id, data) => api.post("/raffles/${id}/distribute/manual", data),
    autoStore: (id, data) => api.post("/raffles/${id}/distribute/auto", data),
};
