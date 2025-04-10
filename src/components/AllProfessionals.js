import React, { useState, useEffect } from "react";
import axios from "axios";

const AllProfessionals = ({ setView }) => {
  // State for professionals fetched from SQL.
  const [professionals, setProfessionals] = useState([]);
  // Filter states
  const [professionFilter, setProfessionFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState(400);

  // Fetch all professionals from the SQL-backed API.
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const res = await axios.get("http://localhost:8000/pros");
        console.log("Fetched professionals:", res.data);
        // If res.data is not an array, use res.data.pros.
        const proArray = Array.isArray(res.data)
          ? res.data
          : res.data.pros || [];
        setProfessionals(proArray);
      } catch (error) {
        console.error("Error fetching professionals:", error);
      }
    };
    fetchProfessionals();
  }, []);

  // Build unique list of professions for the filter dropdown.
  const professions = [...new Set(professionals.map(p => p.profession))];

  // Apply filters: Filter by profession (if selected) and by price.
  const filteredProfessionals = professionals
    .filter(p => (professionFilter ? p.profession === professionFilter : true))
    .filter(p => p.price <= maxPrice);

  return (
    <div className="p-4">
 
      <h1 className="text-2xl mb-4">Our Professionals</h1>
      <div className="flex gap-4 mb-6">
        <select
          value={professionFilter}
          onChange={e => setProfessionFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">כל המקצועות</option>
          {professions.map(p => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <div>
          <label className="mr-2">מחיר עד:</label>
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
          />
          <span className="ml-2">₪{maxPrice}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProfessionals.map(pro => (
          
          <div key={pro.id} className="bg-purple-100 p-4 rounded shadow">
            
            <h2 className="text-lg font-bold">
              {pro.name}
            </h2>
            <p className="text-sm">{pro.profession}</p>
            <p className="text-gray-800 font-semibold">עלות ביקור: ₪{pro.price}</p>
            <p className="text-yellow-500">דירוג ממוצע: {pro.average_rating} ⭐</p>
            <button className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded">
              פרטים
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProfessionals;
