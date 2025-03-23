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

////////////////////////////////////////////////////////// ROOM //////////////////////////////////////////////////////////

export const ParentRoomDetails = async (token, hostel_id, room_no) => {
    try {
        const { data } = await ParentApi.get(`/room/details?hostel_id=${hostel_id}&room_no=${room_no}`, { headers: { "parenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const ParentRoomList = async (token, hostel_id) => {
    try {
        const { data } = await ParentApi.get(`/room/list?hostel_id=${hostel_id}`, { headers: { "parenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// MENU //////////////////////////////////////////////////////////

export const ParentMenuList = async (token, hostel_id) => {
    try {
        const { data } = await ParentApi.get(`/menu/list?hostel_id=${hostel_id}`, { headers: { "parenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// COMPLAINT //////////////////////////////////////////////////////////

export const ParentComplaintList = async (token, hostel_id) => {
    try {
        const { data } = await ParentApi.get(`/complaint/list?hostel_id=${hostel_id}`, { headers: { "parenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// CHECKIN //////////////////////////////////////////////////////////

export const ParentCheckinMonthList = async (token, _id) => {
    try {
        const { data } = await ParentApi.get(`/checkin/month-list?_id=${_id}`, { headers: { "parenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

export const ParentCheckinYearList = async (token, _id) => {
    try {
        const { data } = await ParentApi.get(`/checkin/year-list?_id=${_id}`, { headers: { "parenttoken": token } })
        return data;
    } catch (error) {
        return false
    }
}