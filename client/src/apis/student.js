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

export const StudentForgotPasswordApi = async (form_data) => {
    try {
        const { data } = await StudentApi.post('/forgot-password', form_data)
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

////////////////////////////////////////////////////////// STUDENT //////////////////////////////////////////////////////////

export const StudentProfileUpdate = async (token, form_data) => {
    try {
        const { data } = await StudentApi.patch('/student/update-profile', form_data, { headers: { "studenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const StudentChangePasswordApi = async (token, form_data) => {
    try {
        const { data } = await StudentApi.patch('/student/change-password', form_data, { headers: { "studenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// ROOM //////////////////////////////////////////////////////////

export const StudentRoomDetails = async (token, hostel_id, room_no) => {
    try {
        const { data } = await StudentApi.get(`/room/details?hostel_id=${hostel_id}&room_no=${room_no}`, { headers: { "studenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const StudentRoomList = async (token, hostel_id) => {
    try {
        const { data } = await StudentApi.get(`/room/list?hostel_id=${hostel_id}`, { headers: { "studenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// MENU //////////////////////////////////////////////////////////

export const StudentMenuList = async (token, hostel_id) => {
    try {
        const { data } = await StudentApi.get(`/menu/list?hostel_id=${hostel_id}`, { headers: { "studenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// COMPLAINT //////////////////////////////////////////////////////////
export const StudentComplaintCreate = async (token, form_data) => {
    try {
        const { data } = await StudentApi.post('/complaint/create', form_data, { headers: { "studenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const StudentComplaintList = async (token, hostel_id) => {
    try {
        const { data } = await StudentApi.get(`/complaint/list?hostel_id=${hostel_id}`, { headers: { "studenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// CHECKIN //////////////////////////////////////////////////////////

export const StudentCheckinMonthList = async (token, _id) => {
    try {
        const { data } = await StudentApi.get(`/checkin/month-list?_id=${_id}`, { headers: { "studenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

export const StudentCheckinYearList = async (token, _id) => {
    try {
        const { data } = await StudentApi.get(`/checkin/year-list?_id=${_id}`, { headers: { "studenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}