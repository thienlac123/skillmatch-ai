import client from "./client";

export const applyToJob = async (data) => {
  const response = await client.post("/applications", data);
  return response.data;
};

export const getMyApplications = async () => {
  const response = await client.get("/applications/me");
  return response.data;
};

export const getJobApplications = async (jobId) => {
  const response = await client.get(`/applications/jobs/${jobId}`);
  return response.data;
};

export const updateApplicationStatus = async (applicationId, status) => {
  const response = await client.patch(`/applications/${applicationId}/status`, { status });
  return response.data;
};
