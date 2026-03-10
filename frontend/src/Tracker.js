import React, { useState, useEffect } from "react";

function Tracker() {
  const userId = localStorage.getItem("userId");

  const [medicine, setMedicine] = useState({
    name: "",
    time: "",
    startDate: "",
    endDate: ""
  });

  const [medicines, setMedicines] = useState([]);

  const fetchMedicines = async () => {
    const res = await fetch(
      `http://localhost:5000/api/medicine/get-medicines/${userId}`
    );
    const data = await res.json();
    setMedicines(data);
  };

  useEffect(() => {
  if (!userId) return;

  fetchMedicines(); // initial load

  const interval = setInterval(() => {
    fetchMedicines(); // auto refresh
  }, 10000); // every 10 seconds

  return () => clearInterval(interval); // cleanup
}, [userId]);

  const handleChange = (e) => {
    setMedicine({ ...medicine, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!medicine.name || !medicine.time) {
      alert("Please fill required fields");
      return;
    }

    const response = await fetch(
      "http://localhost:5000/api/medicine/add-medicine",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...medicine, userId })
      }
    );

    if (response.ok) {
      setMedicine({
        name: "",
        time: "",
        startDate: "",
        endDate: ""
      });
      fetchMedicines();
    }
  };

  const handleDelete = async (id) => {
    await fetch(
      `http://localhost:5000/api/medicine/delete-medicine/${id}`,
      { method: "DELETE" }
    );
    fetchMedicines();
  };

  return (
    <>
      <style>{`
        .tracker-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .page-title {
          font-size: 28px;
          font-weight: 600;
          color: #333;
          margin-bottom: 30px;
          text-align: center;
        }

        .card {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 25px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #333;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
        }

        label {
          font-size: 14px;
          margin-bottom: 6px;
          color: #555;
          font-weight: 500;
        }

        input {
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 15px;
        }

        input:focus {
          border-color: #4CAF50;
          outline: none;
        }

        .add-btn {
          width: 100%;
          padding: 14px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 16px;
          margin-top: 10px;
        }

        .add-btn:hover {
          background: #45a049;
        }

        .medicine-item {
          background: #f9f9f9;
          border-left: 4px solid #4CAF50;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .med-name {
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 5px;
          color: #333;
        }

        .med-info {
          font-size: 14px;
          color: #666;
        }

        .delete-btn {
          background: #f44336;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .delete-btn:hover {
          background: #da190b;
        }

        .empty {
          text-align: center;
          color: #999;
          padding: 30px;
          font-size: 15px;
        }

        @media(max-width: 768px){
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .medicine-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>

      <div className="tracker-container">
        <div className="page-title">💊 Medicine Reminders</div>

        {/* ADD MEDICINE */}
        <div className="card">
          <div className="section-title">Add New Medicine</div>

          <div className="form-row">
            <div className="input-group">
              <label>Medicine Name</label>
              <input
                name="name"
                value={medicine.name}
                onChange={handleChange}
                placeholder="Enter medicine name"
              />
            </div>

            <div className="input-group">
              <label>Time</label>
              <input
                type="time"
                name="time"
                value={medicine.time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Start Date (Optional)</label>
              <input
                type="date"
                name="startDate"
                value={medicine.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>End Date (Optional)</label>
              <input
                type="date"
                name="endDate"
                value={medicine.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <button className="add-btn" onClick={handleAdd}>
            Add Medicine
          </button>
        </div>

        {/* MEDICINE LIST */}
        <div className="card">
          <div className="section-title">Your Medicines</div>

          {medicines.length === 0 ? (
            <div className="empty">
              No medicines added yet
            </div>
          ) : (
            medicines.map((med) => (
              <div key={med._id} className="medicine-item">
                <div>
                  <div className="med-name">{med.name}</div>
                  <div className="med-info">
                    ⏰ {med.time} | 
                    {med.startDate ? new Date(med.startDate).toLocaleDateString("en-GB") : "—"} 
                    {" - "} 
                    {med.endDate ? new Date(med.endDate).toLocaleDateString("en-GB") : "—"}
                  </div>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(med._id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
}

export default Tracker;