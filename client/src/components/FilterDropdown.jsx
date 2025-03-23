// import React, { useState } from "react";

const FilterDropdown = ({ key_name, items, selectedValue, setSelectedValue }) => {
    // selected value setting
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedValue((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // return
    return (
        <div>
            <label className="text-sm text-black font-bold block mb-1" htmlFor="dropdown">Select {key_name}:</label>
            <select className="w-full text-xs text-black font-bold bg-gray-200 capitalize p-2 rounded-lg border border-gray-800" name={key_name} id={key_name} value={selectedValue} onChange={handleChange}>
                <option className="font-bold" value="">all</option>
                {items.map((item) => (
                    <option className="font-bold" key={item} value={item}>{item}</option>
                ))}
            </select>
        </div>
    );
};

export default FilterDropdown;
