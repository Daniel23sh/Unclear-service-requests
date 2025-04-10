import React, { useState, useEffect } from "react";
import axios from "axios";

// Helper function to render stars remains unchanged.
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <>
      {Array.from({ length: fullStars }).map((_, i) => (
        <svg
          key={`full-${i}`}
          className="w-4 h-4 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.045 9.393c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.966z" />
        </svg>
      ))}
      {hasHalf && (
        <svg key="half" className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            fill="url(#halfGrad)"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.045 9.393c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.966z"
          />
        </svg>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <svg
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.045 9.393c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.966z" />
        </svg>
      ))}
    </>
  );
};

const TeamCards = ({ category }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedMember, setSelectedMember] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log("TeamCards is rendering with category:", category);

  useEffect(() => {
    if (!category) return;
    const fetchTeamMembers = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `http://localhost:8000/pros?category=${encodeURIComponent(category)}`
        );
        const fetchedMembers = Array.isArray(res.data)
          ? res.data
          : res.data.pros || [];
        const filteredMembers = fetchedMembers.filter(
          (member) => member.category === category
        );
        setTeamMembers(filteredMembers);
        setVisibleCount(3);
      } catch (error) {
        console.error("Error fetching professionals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, [category]);

  const fetchReviews = async (proId) => {
    try {
      setReviewsLoading(true);
      const res = await axios.get(`http://localhost:8000/reviews/${proId}`);
      console.log("Fetched reviews for pro", proId, ":", res.data);
      // Assuming endpoint returns an object: { reviews: [...] }
      setReviews(res.data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const openDetails = (member) => {
    // When opening the modal, fetch the reviews for this professional.
    fetchReviews(member.id);
    setSelectedMember(member);
  };

  const closeDetails = () => {
    setSelectedMember(null);
    setReviews([]);
  };

  const loadMore = () => {
    setVisibleCount(teamMembers.length);
  };

  const collapse = () => {
    setVisibleCount(3);
  };

  if (isLoading) {
    return (
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
    );
  }

  return (
    <div className="container mx-auto p-4" dir="rtl">
      <div className="max-w-3xl mx-auto text-right">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.slice(0, visibleCount).map((member) => (
            <div
              key={member.id}
              className="cursor-pointer bg-purple-100 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              onClick={() => openDetails(member)}
            >
              <img
                src={member.image || "https://via.placeholder.com/150"}
                alt={member.name}
                className="w-full h-32 object-cover object-top rounded-t-lg"
              />
              <div className="p-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  {member.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{member.category}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800">
                      {member.number_of_reviews} ביקורות
                    </span>
                    <div className="flex items-center">
                      {renderStars(member.average_rating)}
                      <span className="ml-1 text-xs text-gray-600">
                        ציון: {Number(member.average_rating).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {teamMembers.length > visibleCount && (
          <div className="flex justify-center mt-4">
            <button 
              onClick={loadMore}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              הצג עוד
            </button>
          </div>
        )}
        {teamMembers.length > 3 && visibleCount === teamMembers.length && (
          <div className="flex justify-center mt-4">
            <button 
              onClick={collapse}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700"
            >
              הסתר
            </button>
          </div>
        )}
        {teamMembers.length === 0 && (
          <div className="flex justify-center mt-4">
            <p>לא נמצאו בעלי מקצוע</p>
          </div>
        )}
      </div>

      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" dir="rtl">
          <div
            className="bg-white rounded-lg shadow-md p-4 relative w-10/12 md:w-1/3 lg:w-1/4 max-h-[80vh] overflow-y-auto text-right"
          >
            <button
              onClick={closeDetails}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {selectedMember.name}
            </h2>
            <h3 className="text-sm text-gray-600 mb-4">
              {selectedMember.category}
            </h3>
            <div className="bg-purple-200 p-3 rounded">
              <h4 className="text-lg font-semibold mb-2 text-gray-800">
                ביקורות:
              </h4>
              {reviewsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <svg
                    className="animate-spin h-8 w-8 text-purple-700"
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
              ) : reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="border-b border-gray-300 py-2">
                    <p className="font-bold">{rev.reviewer_name}</p>
                    <div className="flex items-center">
                      {/** You can create a helper function here similar to renderStars for the review rating */}
                      <span className="mr-2">{rev.rating} ⭐</span>
                    </div>
                    <p>{rev.review_text}</p>
                    <p className="text-xs text-gray-500">{rev.created_at}</p>
                  </div>
                ))
              ) : (
                <p>לא נמצאו ביקורות</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCards;
  