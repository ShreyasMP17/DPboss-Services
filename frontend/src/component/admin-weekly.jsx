import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/admin-weekly.css";
import Logo from "./Logo";
import Footer from "./fotter";

const AdminPannel = () => {
    const { id } = useParams();
    const [lotteryData, setLotteryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(null);
    const [newData, setNewData] = useState({
        week: "",
        data: {
            Mon: { left: "", result: "", right: "" },
            Tue: { left: "", result: "", right: "" },
            Wed: { left: "", result: "", right: "" },
            Thu: { left: "", result: "", right: "" },
            Fri: { left: "", result: "", right: "" },
            Sat: { left: "", result: "", right: "" },
            Sun: { left: "", result: "", right: "" },
        },
    });

    useEffect(() => {
        const fetchLotteryData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/lottery/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch lottery data");
                }
                const data = await response.json();
                setLotteryData(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchLotteryData();
    }, [id]);

    const updateLotteryData = async (updatedData) => {
        try {
            const response = await fetch(`http://localhost:4000/lottery/${id}`, {
                method: "PUT", // Use PUT or PATCH based on your backend implementation
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error("Failed to update lottery data");
            }

            const data = await response.json();
            setLotteryData(data);
            alert("Data successfully updated in the database.");
        } catch (error) {
            alert(`Error updating data: ${error.message}`);
        }
    };

    const handleSave = (index) => {
        const updatedData = { ...lotteryData };

        // Exit editing mode and save to database
        setIsEditing(null);
        updateLotteryData(updatedData);
    };

    const handleInputChange = (e, index, day, field) => {
        const value = e.target.value;
        setLotteryData((prev) => {
            const updatedResults = [...prev.weeklyResults];
            const updatedDayData = { ...updatedResults[index].data[day], [field]: value };
            updatedResults[index].data[day] = updatedDayData;
            return { ...prev, weeklyResults: updatedResults };
        });
    };

    const handleDelete = async (index) => {
        const updatedResults = lotteryData.weeklyResults.filter((_, i) => i !== index);

        const updatedData = { ...lotteryData, weeklyResults: updatedResults };
        setLotteryData(updatedData);
        updateLotteryData(updatedData); // Update database after deleting
    };

    const handleNewDataChange = (e, day, field) => {
        const value = e.target.value;
        setNewData((prev) => ({
            ...prev,
            data: {
                ...prev.data,
                [day]: {
                    ...prev.data[day],
                    [field]: value,
                },
            },
        }));
    };

    const handleAddNewData = () => {
        const updatedData = {
            ...lotteryData,
            weeklyResults: [...lotteryData.weeklyResults, newData],
        };
        setLotteryData(updatedData);
        updateLotteryData(updatedData); // Update database after adding new data
        setNewData({
            week: "",
            data: {
                Mon: { left: "", result: "", right: "" },
                Tue: { left: "", result: "", right: "" },
                Wed: { left: "", result: "", right: "" },
                Thu: { left: "", result: "", right: "" },
                Fri: { left: "", result: "", right: "" },
                Sat: { left: "", result: "", right: "" },
                Sun: { left: "", result: "", right: "" },
            },
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!lotteryData) return <div>No data found for ID: {id}</div>;

    return (
        <div>
            <Logo />
            <div className="container-fluid">
                <h1 className="chart-h1">{lotteryData.name} PANEL CHART</h1>

                <div className="pannel panel-info">
                    <div className="panel-heading">
                        <h3>{lotteryData.name} MATKA PANNEL RECORD 2019 - 2024</h3>
                    </div>

                    <div className="panel-body">
                        <div className="responsive-table">
                            <table className="panel-chart chart-table" cellPadding="2">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Mon</th>
                                        <th>Tue</th>
                                        <th>Wed</th>
                                        <th>Thu</th>
                                        <th>Fri</th>
                                        <th>Sat</th>
                                        <th>Sun</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lotteryData.weeklyResults.map((result, index) => (
                                        <tr key={index}>
                                            <td>{result.week}</td>
                                            {Object.keys(result.data).map((day, i) => (
                                                <td key={i}>
                                                    {isEditing === index ? (
                                                        <>
                                                            <input
                                                                type="text"
                                                                placeholder="Left"
                                                                value={result.data[day]?.left || ""}
                                                                onChange={(e) =>
                                                                    handleInputChange(e, index, day, "left")
                                                                }
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Result"
                                                                value={result.data[day]?.result || ""}
                                                                onChange={(e) =>
                                                                    handleInputChange(e, index, day, "result")
                                                                }
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Right"
                                                                value={result.data[day]?.right || ""}
                                                                onChange={(e) =>
                                                                    handleInputChange(e, index, day, "right")
                                                                }
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div>{result.data[day]?.left || "-"}</div>
                                                            <div>{result.data[day]?.result || "-"}</div>
                                                            <div>{result.data[day]?.right || "-"}</div>
                                                        </>
                                                    )}
                                                </td>
                                            ))}
                                            <td>
                                                {isEditing === index ? (
                                                    <>
                                                        <button onClick={() => handleSave(index)}>Save</button>
                                                        <button onClick={() => setIsEditing(null)}>Cancel</button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => setIsEditing(index)}>Edit</button>
                                                )}
                                                <button onClick={() => handleDelete(index)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="add-new-data">
                        <h3>Add New Data</h3>
                        <input
                            type="text"
                            placeholder="Week"
                            value={newData.week}
                            onChange={(e) => setNewData({ ...newData, week: e.target.value })}
                        />
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                            <div key={day}>
                                <label>{day}</label>
                                <input
                                    type="text"
                                    placeholder="Left"
                                    value={newData.data[day]?.left || ""}
                                    onChange={(e) => handleNewDataChange(e, day, "left")}
                                />
                                <input
                                    type="text"
                                    placeholder="Result"
                                    value={newData.data[day]?.result || ""}
                                    onChange={(e) => handleNewDataChange(e, day, "result")}
                                />
                                <input
                                    type="text"
                                    placeholder="Right"
                                    value={newData.data[day]?.right || ""}
                                    onChange={(e) => handleNewDataChange(e, day, "right")}
                                />
                            </div>
                        ))}
                        <button onClick={handleAddNewData}>Add</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AdminPannel;









// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import "../styles/pannel.css";
// import Logo from "./Logo";
// import Footer from "./fotter";

// const AdminPannel = () => {
//     const { id } = useParams(); // Get the ID from the URL
//     const [lotteryData, setLotteryData] = useState(null); // State to store the fetched data
//     const [loading, setLoading] = useState(true); // State to manage loading
//     const [error, setError] = useState(null); // State to manage errors
//     const [isEditing, setIsEditing] = useState(false); // Manage edit mode
//     const [newData, setNewData] = useState({
//         week: "",
//         data: {},
//     }); // Manage new data entry

//     useEffect(() => {
//         const fetchLotteryData = async () => {
//             try {
//                 const response = await fetch(`http://localhost:4000/lottery/${id}`);
//                 if (!response.ok) {
//                     throw new Error("Failed to fetch lottery data");
//                 }
//                 const data = await response.json();
//                 setLotteryData(data); // Set the fetched data
//                 setLoading(false); // Set loading to false once data is fetched
//             } catch (error) {
//                 setError(error.message); // Set error message
//                 setLoading(false); // Set loading to false if an error occurs
//             }
//         };

//         fetchLotteryData();
//     }, [id]); // Re-run when ID changes

//     const isResultDoubleDigits = (result) => {
//         return result?.length === 2 && result[0] === result[1];
//     };

//     const handleAddNewData = () => {
//         setLotteryData((prev) => ({
//             ...prev,
//             weeklyResults: [...prev.weeklyResults, newData],
//         }));
//         setNewData({ week: "", data: {} }); // Reset new data input
//     };

//     const handleEdit = (index) => {
//         setIsEditing(index);
//     };

//     const handleSave = (index) => {
//         setIsEditing(false);
//     };

//     const handleInputChange = (e, day, field) => {
//         const value = e.target.value;
//         setNewData((prev) => ({
//             ...prev,
//             data: {
//                 ...prev.data,
//                 [day]: {
//                     ...prev.data[day],
//                     [field]: value,
//                 },
//             },
//         }));
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     if (!lotteryData) {
//         return <div>No data found for ID: {id}</div>;
//     }

//     return (
//         <div>
//             <div className="">
//                 <Logo />
//             </div>
//             <div className="container-fluid">
//                 <h1 className="chart-h1">{lotteryData.name} PANEL CHART </h1>

//                 <div className="pannel panel-info">
//                     <div className="panel-heading">
//                         <h3> {lotteryData.name} MATKA PANNEL RECORD 2019 - 2024</h3>
//                     </div>

//                     <div className="panel-body">
//                         <table className="panel-chart chart-table" cellPadding="2">
//                             <thead>
//                                 <tr>
//                                     <th>Date</th>
//                                     <th>Mon</th>
//                                     <th>Tue</th>
//                                     <th>Wed</th>
//                                     <th>Thu</th>
//                                     <th>Fri</th>
//                                     <th>Sat</th>
//                                     <th>Sun</th>
//                                     <th>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {lotteryData.weeklyResults.map((result, index) => (
//                                     <tr key={index}>
//                                         <td>{result.week}</td>
//                                         {Object.keys(result.data).map((day, i) => {
//                                             const dayData = result.data[day];
//                                             const shouldHighlight = isResultDoubleDigits(dayData.result);

//                                             return (
//                                                 <td key={i}>
//                                                     <div
//                                                         className={`lottery-cell ${
//                                                             shouldHighlight ? "highlight-red" : ""
//                                                         }`}
//                                                     >
//                                                         {isEditing === index ? (
//                                                             <>
//                                                                 <input
//                                                                     type="text"
//                                                                     placeholder="Left"
//                                                                     value={dayData.left || ""}
//                                                                     onChange={(e) => handleInputChange(e, day, "left")}
//                                                                 />
//                                                                 <input
//                                                                     type="text"
//                                                                     placeholder="Result"
//                                                                     value={dayData.result || ""}
//                                                                     onChange={(e) => handleInputChange(e, day, "result")}
//                                                                 />
//                                                                 <input
//                                                                     type="text"
//                                                                     placeholder="Right"
//                                                                     value={dayData.right || ""}
//                                                                     onChange={(e) => handleInputChange(e, day, "right")}
//                                                                 />
//                                                             </>
//                                                         ) : (
//                                                             <>
//                                                                 <div className="left-cell">{dayData.left}</div>
//                                                                 <div className="mid-cell">{dayData.result}</div>
//                                                                 <div className="right-cell">{dayData.right}</div>
//                                                             </>
//                                                         )}
//                                                     </div>
//                                                 </td>
//                                             );
//                                         })}
//                                         <td>
//                                             {isEditing === index ? (
//                                                 <button onClick={() => handleSave(index)}>Save</button>
//                                             ) : (
//                                                 <button onClick={() => handleEdit(index)}>Edit</button>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     <div>
//                         <h3>Add New Data</h3>
//                         <input
//                             type="text"
//                             placeholder="Week"
//                             value={newData.week}
//                             onChange={(e) => setNewData({ ...newData, week: e.target.value })}
//                         />
//                         {[
//                             "Mon",
//                             "Tue",
//                             "Wed",
//                             "Thu",
//                             "Fri",
//                             "Sat",
//                             "Sun",
//                         ].map((day, i) => (
//                             <div key={i}>
//                                 <label>{day}</label>
//                                 <input
//                                     type="text"
//                                     placeholder="Left"
//                                     onChange={(e) => handleInputChange(e, day, "left")}
//                                 />
//                                 <input
//                                     type="text"
//                                     placeholder="Result"
//                                     onChange={(e) => handleInputChange(e, day, "result")}
//                                 />
//                                 <input
//                                     type="text"
//                                     placeholder="Right"
//                                     onChange={(e) => handleInputChange(e, day, "right")}
//                                 />
//                             </div>-
//                         ))}
//                         <button onClick={handleAddNewData}>Add</button>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// };

// export default AdminPannel;