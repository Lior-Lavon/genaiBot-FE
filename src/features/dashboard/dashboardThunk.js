import customFetch from "../../utills/customFetch";

export const getThunk = async (url, thunkAPI) => {
  try {
    const resp = await customFetch.get(url);
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.msg);
  }
};

export const postThunk = async (url, body, thunkAPI) => {
  try {
    const resp = await customFetch.post(url, body);
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.msg);
  }
};
