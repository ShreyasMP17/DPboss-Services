import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Demon = () => {
  const { id } = useParams();
  const [lotteryData, setLotteryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [editedData, setEditedData] = useState({
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
        const response = await axios.get("http://localhost:3000/get-data");
        setLotteryData(response.data.weeklyResults);
        setLoading(false);
      } catch (error) {
        setError(error.message || "Failed to fetch lottery data");
        setLoading(false);
      }
    };

    fetchLotteryData();
  }, [id]);

  const updateLotteryData = async (updatedData) => {
    try {
      const response = await axios.put(`http://localhost:3000/get-data/${id}`, updatedData);
      setLotteryData(response.data);
      alert("Data updated successfully!");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleEdit = (index) => {
    setIsEditing(index);
    setEditedData(lotteryData[index]);
  };

  const handleSave = () => {
    setIsEditing(null);
    updateLotteryData(editedData);
  };

  const handleInputChange = (e, day, field) => {
    const value = e.target.value;
    setEditedData(prev => ({
      ...prev,
      data: { ...prev.data, [day]: { ...prev.data[day], [field]: value } },
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Lottery Data</h1>
      <table>
        <thead>
          <tr>
            <th>Week</th>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <th key={day}>{day}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lotteryData.map((week, index) => (
            <tr key={index}>
              <td>{week.week}</td>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <td key={day}>
                  {isEditing === index ? (
                    <input
                      type="text"
                      value={editedData.data[day]?.left || ""}
                      onChange={(e) => handleInputChange(e, day, "left")}
                    />
                  ) : (
                    <span>{week.data[day]?.left || "-"}</span>
                  )}
                </td>
              ))}
              <td>
                {isEditing === index ? (
                  <button onClick={handleSave}>Save</button>
                ) : (
                  <button onClick={() => handleEdit(index)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Demon;






// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import "../styles/pannel.css";
// import Logo from "./Logo";
// import Footer from "./fotter";
// import axios from "axios";

// const Demon = () => {
//   const { id } = useParams();
//   const [lotteryData, setLotteryData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [name, setName] = useState(null);
//   const [newRecord, setNewRecord] = useState({
//     week: "",
//     data: {
//       Mon: { left: [], result: "", right: [] },
//       Tue: { left: [], result: "", right: [] },
//       Wed: { left: [], result: "", right: [] },
//       Thu: { left: [], result: "", right: [] },
//       Fri: { left: [], result: "", right: [] },
//       Sat: { left: [], result: "", right: [] },
//       Sun: { left: [], result: "", right: [] },
//     },
//   });
//   const [editRecord, setEditRecord] = useState(null);

//   useEffect(() => {
//     const fetchWeeklyResults = async () => {
//       try {
//         const response = await axios.get("http://localhost:3000/get-data");
//         const data = response.data.data.find((item) => item.id === parseInt(id));
//         setLotteryData(data ? data.weeklyResults : []);
//         setName(data.name)

//       } catch (err) {
//         setError("Error fetching weekly results");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWeeklyResults();
//   }, [id]);


//   const handleAddNew = async () => {
//     try {
//       const response = await axios.post(`http://localhost:3000/get-data/${id}`, newRecord);
//       setLotteryData([...lotteryData, response.data.record]);
//       setNewRecord({
//         week: "",
//         data: {
//           Mon: { left: [], result: "", right: [] },
//           Tue: { left: [], result: "", right: [] },
//           Wed: { left: [], result: "", right: [] },
//           Thu: { left: [], result: "", right: [] },
//           Fri: { left: [], result: "", right: [] },
//           Sat: { left: [], result: "", right: [] },
//           Sun: { left: [], result: "", right: [] },
//         },
//       });
//     } catch (err) {
//       alert("Error adding new record");
//     }
//   };

//   const handleEdit = (record) => {
//     setEditRecord(record);
//   };

//   const handleUpdate = async () => {
//     try {
//       const response = await axios.put(
//         `http://localhost:3000/get-data/${id}/${editRecord._id}`,
//         editRecord
//       );
//       setLotteryData(
//         lotteryData.map((record) =>
//           record._id === editRecord._id ? response.data.updatedRecord : record
//         )
//       );
//       setEditRecord(null);
//     } catch (err) {
//       alert("Error updating record");
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;
//   const isResultDoubleDigits = (result) => {
//     return result?.length === 2 && result[0] === result[1];
// };


//   return (
//     <div>
      
//       {lotteryData.map((result, index) => (
//                                 <tr key={index}>
//                                     <td>{result.week}</td>
//                                     {Object.keys(result.data).map((day, i) => {
//                                         const dayData = result.data[day];
//                                         const shouldHighlight = isResultDoubleDigits(dayData.result);

//                                         return (
//                                             <td key={i}>
//                                                 <div
//                                                     className={`lottery-cell ${
//                                                         shouldHighlight ? "highlight-red" : ""
//                                                     }`}
//                                                 >
//                                                     <div className="left-cell">
//                                                         {dayData.left.map((num, idx) => (
//                                                             <div key={idx}>{num}</div>
//                                                         ))}
//                                                     </div>
//                                                     <div className="mid-cell">{dayData.result}</div>
//                                                     <div className="right-cell">
//                                                         {dayData.right.map((num, idx) => (
//                                                             <div key={idx}>{num}</div>
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                         );
//                                     })}
//                                 </tr>
//                             ))}
//     </div>
//   );
// };

// export default Demon;

