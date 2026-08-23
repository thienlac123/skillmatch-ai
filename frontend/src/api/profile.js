import client from "./client";

export const getProfile = async () => {
  const userRes = await client.get("/users/me");
  const user = userRes.data;

  let profileData = {};
  if (user.role === "freelancer") {
    try {
      const profileRes = await client.get(`/freelancers/${user.id}`);
      profileData = profileRes.data;
    } catch (err) {
      if (err.response?.status !== 404) throw err;
    }
  }

  return {
    ...user,
    ...profileData,
    experience_years: profileData.experience_years ?? 0,
    skills: profileData.skills || [],
  };
};

export const uploadCV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await client.post("/freelancers/me/cv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const addSkill = async (skillName, level = "intermediate", yearsExperience = 1) => {
  const response = await client.post("/freelancers/me/skills", {
    name: skillName,
    level: level,
    years_experience: Number(yearsExperience),
  });
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await client.put("/freelancers/me", data);
  return response.data;
};

export const downloadCV = async () => {
  const response = await client.get("/freelancers/me/cv", {
    responseType: "blob",
  });
  return response.data;
};

export const getPublicProfile = async (userId) => {
  const response = await client.get(`/freelancers/${userId}/public`);
  return response.data;
};