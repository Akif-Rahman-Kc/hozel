import { ParentApi } from "../constant/constant";

////////////////////////////////////////////////////////// AUTH //////////////////////////////////////////////////////////

export const ParentLoginApi = async (form_data) => {
    try {
        const { data } = await ParentApi.post('/login', form_data)
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const ParentAuthApi = async (token) => {
    try {
        const { data } = await ParentApi.post('/auth', {}, { headers: { "parenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}