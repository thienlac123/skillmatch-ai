import client from "./client";

export const getJobs =
  async () => {

    const response =
      await client.get("/jobs");

    return response.data;
  };

export const getJob =
  async (id) => {

    const response =
      await client.get(
        `/jobs/${id}`
      );

    return response.data;
  };

export const getMyJobs = async () => {
  const response = await client.get("/jobs/mine");
  return response.data;
};

export const createJob = async (data) => {
  const response = await client.post("/jobs", data);
  return response.data;
};