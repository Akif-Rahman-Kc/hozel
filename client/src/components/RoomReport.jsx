import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { HostelRoomsReport } from '../apis/hostel';
import { saveAs } from "file-saver";
import { utils, writeFile } from "xlsx";
import Papa from "papaparse";

const RoomReportChart = () => {
    // get current admin ( hostel or parent or student)
    const admin = localStorage.getItem("admin")

    // states
    const [data, setData] = useState([]);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        async function fetchData() {
            if (admin === "hostel") {
                const currentYear = new Date().getFullYear();
                const token = localStorage.getItem("hosteltoken")
                const response = await HostelRoomsReport(token, currentYear)
                if (response && response.status === "success") {
                    setData(response.report_data)
                    setRooms(response.room_list)
                } else {
                    alert(response?.message)
                }
            }
        }
        fetchData()
    }, []);

    // export to csv
    const exportToCSV = () => {
        const csv = Papa.unparse(rooms);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "rooms_report.csv");
    };
    
    // export to excel
    const exportToExcel = () => {
        const worksheet = utils.json_to_sheet(rooms);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Rooms Report");
        writeFile(workbook, "rooms_report.xlsx");
    };

    // return
    return (
        <div className="p-6 mt-4">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <XAxis dataKey="month" tick={{ fill: "black" }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rooms" fill="#00940c" />
                </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-end">
                <button onClick={exportToCSV} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2 rounded-lg mr-2">
                    Download CSV
                </button>
                <button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-6 py-2 rounded-lg">
                    Download Excel
                </button>
            </div>
        </div>
    );
};

export default RoomReportChart;