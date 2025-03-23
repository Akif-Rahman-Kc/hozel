import { HostelApi } from "../constant/constant";

////////////////////////////////////////////////////////// AUTH //////////////////////////////////////////////////////////

export const HostelRegisterApi = async (form_data) => {
    try {
        const { data } = await HostelApi.post('/register', form_data)
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const HostelLoginApi = async (form_data) => {
    try {
        const { data } = await HostelApi.post('/login', form_data)
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const HostelForgotPasswordApi = async (form_data) => {
    try {
        const { data } = await HostelApi.post('/forgot-password', form_data)
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const HostelAuthApi = async (token) => {
    try {
        const { data } = await HostelApi.post('/auth', {}, { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// STUDENT //////////////////////////////////////////////////////////

export const HostelStudentCreate = async (token, form_data) => {
    try {
        const { data } = await HostelApi.post('/student/create', form_data, { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const HostelStudentList = async (token) => {
    try {
        const { data } = await HostelApi.get('/student/list', { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const HostelStudentUpdate = async (token, form_data) => {
    try {
        const { data } = await HostelApi.patch('/student/update', form_data, { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const HostelStudentStatusUpdate = async (token, form_data) => {
    try {
        const { data } = await HostelApi.patch('/student/update-status', form_data, { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const HostelStudentDelete = async (token, _id) => {
    try {
        const { data } = await HostelApi.delete(`/student/delete?_id=${_id}`, { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// PARENT //////////////////////////////////////////////////////////

export const HostelParentList = async (token) => {
    try {
        const { data } = await HostelApi.get('/parent/list', { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// ROOM //////////////////////////////////////////////////////////

export const HostelRoomCreate = async (token, form_data) => {
    try {
        const { data } = await HostelApi.post('/room/create', form_data, { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const HostelRoomList = async (token) => {
    try {
        const { data } = await HostelApi.get('/room/list', { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const HostelRoomUpdate = async (token, form_data) => {
    try {
        const { data } = await HostelApi.patch('/room/update', form_data, { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const HostelRoomStatusUpdate = async (token, form_data) => {
    try {
        const { data } = await HostelApi.patch('/room/update-status', form_data, { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const HostelRoomDelete = async (token, _id) => {
    try {
        const { data } = await HostelApi.delete(`/room/delete?_id=${_id}`, { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// MENU //////////////////////////////////////////////////////////

export const HostelMenuList = async (token) => {
    try {
        const { data } = await HostelApi.get('/menu/list', { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const HostelMenuUpdate = async (token, form_data) => {
    try {
        const { data } = await HostelApi.patch('/menu/update', form_data, { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// COMPLAINT //////////////////////////////////////////////////////////

export const HostelComplaintList = async (token) => {
    try {
        const { data } = await HostelApi.get('/complaint/list', { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const HostelComplaintStatusUpdate = async (token, form_data) => {
    try {
        const { data } = await HostelApi.patch('/complaint/update-status', form_data, { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// CHECKIN //////////////////////////////////////////////////////////

export const HostelCheckinCreate = async (token, form_data) => {
    try {
        const { data } = await HostelApi.post('/checkin/create', form_data, { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const HostelCheckinList = async (token) => {
    try {
        const { data } = await HostelApi.get('/checkin/list', { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// ENTRY EXIT //////////////////////////////////////////////////////////

export const HostelEntryExitMarkExit = async (token, form_data) => {
    try {
        const { data } = await HostelApi.post('/entryexit/mark-exit', form_data, { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const HostelEntryExitMarkEntry = async (token, form_data) => {
    try {
        const { data } = await HostelApi.post('/entryexit/mark-entry', form_data, { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const HostelEntryExitList = async (token) => {
    try {
        const { data } = await HostelApi.get('/entryexit/list', { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// REPORTS //////////////////////////////////////////////////////////

export const HostelStudentsReport = async (token, year) => {
    try {
        const { data } = await HostelApi.get(`/report/student?year=${year}`, { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const HostelComplaintsReport = async (token, year) => {
    try {
        const { data } = await HostelApi.get(`/report/complaint?year=${year}`, { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const HostelRoomsReport = async (token, year) => {
    try {
        const { data } = await HostelApi.get(`/report/room?year=${year}`, { headers: { "hosteltoken": token } })
        return data;
    } catch (error) {
        return false
    }
}