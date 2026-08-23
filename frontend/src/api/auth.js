import client from "./client";

export const register = async (data) => {
  const response =
    await client.post(
      "/auth/register",
      data
    );

  return response.data;
};

export const login = async (data) => {
  const response =
    await client.post(
      "/auth/login",
      data
    );

  return response.data;
};

export const getCurrentUser =
  async () => {

    const response =
      await client.get("/users/me");

    return response.data;
  };