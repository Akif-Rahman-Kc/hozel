import { StudentApi } from "../constant/constant";

////////////////////////////////////////////////////////// AUTH //////////////////////////////////////////////////////////

export const StudentLoginApi = async (form_data) => {
    try {
        const { data } = await StudentApi.post('/login', form_data)
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const StudentAuthApi = async (token) => {
    try {
        const { data } = await StudentApi.post('/auth', {}, { headers: { "studenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}