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

////////////////////////////////////////////////////////// STUDENT //////////////////////////////////////////////////////////

export const ParentStudentList = async (token) => {
    try {
        const { data } = await ParentApi.get('/student/list', { headers: { "parenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const ParentStudentUpdate = async (token, form_data) => {
    try {
        const { data } = await ParentApi.patch('/student/update', form_data, { headers: { "parenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const ParentStudentStatusUpdate = async (token, form_data) => {
    try {
        const { data } = await ParentApi.patch('/student/update-status', form_data, { headers: { "parenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const ParentStudentDelete = async (token, _id) => {
    try {
        const { data } = await ParentApi.delete(`/student/delete?_id=${_id}`, { headers: { "parenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// MENU //////////////////////////////////////////////////////////

export const ParentMenuList = async (token) => {
    try {
        const { data } = await ParentApi.get('/menu/list', { headers: { "parenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// ORDER //////////////////////////////////////////////////////////

export const ParentOrderList = async (token) => {
    try {
        const { data } = await ParentApi.get('/order/list', { headers: { "parenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}