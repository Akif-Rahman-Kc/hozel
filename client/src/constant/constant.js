import axios from "axios";

export const HostelApi = axios.create({baseURL:"http://localhost:4000/hostel/"})
export const ParentApi = axios.create({baseURL:"http://localhost:4000/parent/"})
export const StudentApi = axios.create({baseURL:"http://localhost:4000/"})