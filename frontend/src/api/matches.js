import client from "./client";

export const createMatch =
  async (jobId) => {

    const response =
      await client.post(
        "/matches",
        {
          job_id: jobId,
        }
      );

    return response.data;
  };

export const getMatch =
  async (matchId) => {

    const response =
      await client.get(
        `/matches/${matchId}`
      );

    return response.data;
  };