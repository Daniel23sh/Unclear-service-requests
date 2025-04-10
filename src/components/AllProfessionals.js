import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const AllProfessionals = ({ setView }) => {
  // State for professionals fetched from the SQL-backed API.
  const [professionals, setProfessionals] = useState([]);
  // Filter states.
  const [professionFilter, setProfessionFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState(400);
  const { t } = useTranslation();
  // Loading state.
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all professionals from the SQL-backed API.
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("http://localhost:8000/pros");
        console.log("Fetched professionals:", res.data);
        // If res.data is not an array, use res.data.pros.
        const proArray = Array.isArray(res.data)
          ? res.data
          : res.data.pros || [];
        setProfessionals(proArray);
      } catch (error) {
        console.error("Error fetching professionals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfessionals();
  }, []);

  // Load professions from the translation file (only in Hebrew).
  const professionObject = t("professions", { returnObjects: true });
  const professionList = Object.values(professionObject);

  // Apply filters: by profession (if selected) and by price.
  const filteredProfessionals = professionals
    .filter(p => (professionFilter ? p.category === professionFilter : true))
    .filter(p => p.price <= maxPrice);

  return (
    <div className="p-4">
      {/* Red Back Button at the Upper Right */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setView("home")}
          className="px-4 py-2 bg-purple-700 text-white rounded mt-16 hover:bg-purple-900"
        >
          {t("homepage")}
        </button>
      </div>
      
      <h1 className="text-2xl mb-4">{t("Pro")}</h1>
      <div className="flex gap-4 mb-6">
        <select
          value={professionFilter}
          onChange={e => setProfessionFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">{t("alljobs")}</option>
          {professionList.map(p => (
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

      {/* Loading indicator */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <svg
            className="animate-spin h-10 w-10 text-purple-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProfessionals.map(pro => (
            <div
              key={pro.id}
              className="bg-purple-100 p-4 rounded shadow flex items-center justify-between"
            >
              {/* Left side: Professional info */}
              <div className="flex-1">
                <h2 className="text-lg font-bold">{pro.name}</h2>
                <p className="text-sm">{pro.profession}</p>
                <p className="text-gray-800 font-semibold">עלות ביקור: ₪{pro.price}</p>
                <p className="text-yellow-500">דירוג ממוצע: {pro.average_rating} ⭐</p>
                <button className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded">
                  פרטים
                </button>
              </div>
              {/* Right side: Professional photo */}
              <div className="w-32 h-32 ml-4 flex-shrink-0 bg-transparent rounded overflow-hidden">
                <img
                  src={pro.image || "https://via.placeholder.com/150"}
                  alt={pro.name}
                  className="object-cover w-full h-full rounded"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProfessionals;
