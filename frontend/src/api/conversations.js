import client from "./client";

export const createConversation = async (jobId, freelancerId) => {
  const response = await client.post("/conversations", { job_id: jobId, freelancer_id: freelancerId });
  return response.data;
};

export const getConversations = async () => {
  const response = await client.get("/conversations");
  return response.data;
};

export const getMessages = async (conversationId) => {
  const response = await client.get(`/conversations/${conversationId}/messages`);
  return response.data;
};

export const sendMessage = async (conversationId, content) => {
  const response = await client.post(`/conversations/${conversationId}/messages`, { content });
  return response.data;
};
