import customFetch from "../../utills/customFetch";

export const fetchMappingThunk = async (url, thunkAPI) => {
  console.log("fetchMappingThunk url : ", url);

  try {
    const resp = await customFetch.get(url);
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.msg);
  }
};

export const cacheDataThunk = async (url, body, thunkAPI) => {
  console.log("cacheDataThunk url : ", url);

  try {
    const resp = await customFetch.post(url, body);
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.msg);
  }
};
