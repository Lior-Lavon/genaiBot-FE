import customFetch from "../../utills/customFetch";

export const fetchMappingThunk = async (url, thunkAPI) => {
  try {
    const resp = await customFetch.get(url);
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.msg);
  }
};

export const getTokenThunk = async (url, thunkAPI) => {
  try {
    const resp = await customFetch.post(url);
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.msg);
  }
};
