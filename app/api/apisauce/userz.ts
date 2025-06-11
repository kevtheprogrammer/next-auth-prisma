import client from "../client";

const list = async (options = {}) => {
  return client.get(
    `/dashboard/api/users`,
    {
      ...options,
      headers: {
        Accept: "application/json"
      }
    }
  );
};

 
 
export default {
  list,
};
