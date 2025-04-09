// components/ProblemForm.jsx
import { useState } from "react";
import axios from "axios";

const ProblemForm = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/analyze", {
        message: input,
      });

      const data = res.data;
      setResult(data);

      // If clarification is needed, keep the input for user to modify
      if (data.clarification_needed) {
        alert("Can you describe the issue in more detail?");
      } else {
        setInput(""); // clear on success
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          className="border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your issue..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>

      {result && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <p><strong>User Input:</strong> {result.user_input}</p>
          <p><strong>Identified Problem:</strong> {result.identified_problem}</p>
          <p><strong>Problem Category:</strong> {result.problem_category}</p>
          {result.clarification_needed && (
            <p className="text-red-500 mt-2">
              We couldn't determine the problem. Please clarify your issue.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProblemForm;
