import client from "./client";

export const generateRoadmap = async (jobId) => {
  const response = await client.post("/roadmaps", {
    job_id: jobId,
  });
  return response.data;
};

export const getRoadmapById = async (roadmapId) => {
  const response = await client.get(`/roadmaps/${roadmapId}`);
  return response.data;
};

export const getRoadmaps = async () => {
  const response = await client.get("/roadmaps");
  return response.data;
};