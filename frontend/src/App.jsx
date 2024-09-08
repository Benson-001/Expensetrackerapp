import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaWindowClose } from "react-icons/fa";
import { PieChart } from "@mui/x-charts/PieChart";
import { publicRequest } from "./requestMethods";

function App() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [updatedID, setUpdatedID] = useState("");
  const [updatedLabel, setUpdatedLabel] = useState("");
  const [updatedAmount, setUpdatedAmount] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const handleAddExpense = () => {
    setShowAddExpense(!showAddExpense);
  };

  const handleShowReport = () => {
    setShowReport(!showReport);
  };

  const handleShowEdit = (id) => {
    setShowEdit(!showEdit);
    setUpdatedID(id);
  };

  const handleUpdateExpense = async () => {
    if (updatedID) {
      try {
        await publicRequest.put(`/expenses/${updatedID}`, {
          value: updatedAmount,
          label: updatedLabel,
          date: updatedDate,
        });

        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleExpense = async () => {
    try {
      await publicRequest.post("/expenses", {
        label,
        date,
        value: amount,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getExpenses = async () => {
      try {
        const res = await publicRequest.get("/expenses");
        setExpenses(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getExpenses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await publicRequest.delete(`/expenses/${id}`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  // Filtered expenses based on search term
  const filteredExpenses = expenses.filter(expense =>
    expense.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total amount
  const totalAmount = filteredExpenses.reduce((total, expense) => total + expense.value, 0);

  return (
    <div>
      <div className="flex flex-col justify-center items-center mt-[3%] w-[80%] mr-[5%] ml-[5%]">
        <h1 className="text-2xl font-medium text-[#555]">Expense Tracker</h1>

        <div className="relative flex items-center justify-between mt-5 w-[100%]">
          <div className="relative flex justify-between w-[300px]">
            <button
              className="bg-[#af8978] p-[10px] border-none outline-none cursor-pointer text-[#fff] text-medium"
              onClick={handleAddExpense}
            >
              Add Expense
            </button>
            <button
              className="bg-blue-300 p-[10px] border-none outline-none cursor-pointer text-[#fff] text-medium"
              onClick={handleShowReport}
            >
              Expense Report
            </button>
          </div>

          {showAddExpense && (
            <div className="absolute z-[999] flex flex-col p-[10px] top-[20px] left-0 h-[500px] w-[500px] bg-white shadow-xl">
              <FaWindowClose
                className="flex justify-end items-end text-2xl text-red-500 cursor-pointer"
                onClick={handleAddExpense}
              />
              <label htmlFor="" className="mt-[10px] font-semibold text-[18px]">
                Expense Name
              </label>
              <input
                type="text"
                placeholder="Snacks"
                className="outline-none border-2 border-[#555] border-solid p-[10px]"
                onChange={(e) => setLabel(e.target.value)}
              />
              <label htmlFor="" className="mt-[10px] font-semibold text-[18px]">
                Expense Date
              </label>
              <input
                type="date"
                placeholder="10/08/2024"
                className="outline-none border-2 border-[#555] border-solid p-[10px]"
                onChange={(e) => setDate(e.target.value)}
              />
              <label htmlFor="" className="mt-[10px] font-semibold text-[18px]">
                Expense Amount
              </label>
              <input
                type="number"
                placeholder="$ 50"
                className="outline-none border-2 border-[#555] border-solid p-[10px]"
                onChange={(e) => setAmount(e.target.value)}
              />

              <button
                className="bg-[#af8978] text-white p-[10px] border-none cursor-pointer my-[10px]"
                onClick={handleExpense}
              >
                Add Expense
              </button>
            </div>
          )}

          {showReport && (
            <div className="absolute z-[999] flex flex-col p-[10px] top-[20px] left-[100px] h-[500px] w-[500px] bg-white shadow-xl">
              <FaWindowClose
                className="flex justify-end items-end text-2xl text-red-500 cursor-pointer"
                onClick={handleShowReport}
              />

              <PieChart
                series={[
                  {
                    data: filteredExpenses,
                    innerRadius: 30,
                    outerRadius: 100,
                    paddingAngle: 5,
                    cornerRadius: 5,
                    startAngle: -90,
                    endAngle: 180,
                    cx: 150,
                    cy: 150,
                  },
                ]}
              />
              <div className="mt-4 text-lg font-medium">
                Total Amount: ${totalAmount}
              </div>
            </div>
          )}

          <div>
            <input
              type="text"
              placeholder="Search"
              className="p-[10px] w-[150px] border-2 border-[#444] border-solid"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col">
          {filteredExpenses.map((item, index) => (
            <div
              key={index}
              className="relative flex justify-between items-center w-[80vw] h-[100px] bg-[#f3edeb] my-[20px] py-[10px]"
            >
              <h2 className="m-[20px] text-[#555] text-[18px] font-medium">
                {item.label}
              </h2>
              <span className="m-[20px] text-[18px]">{item.date}</span>
              <span className="m-[20px] text-[18px] font-medium">
                $ {item.value}
              </span>

              <div className="m-[20px]">
                <FaTrash
                  className="text-red-500 mb-[10px] cursor-pointer"
                  onClick={() => handleDelete(item._id)}
                />
                <FaEdit
                  className="text-[#555] mb-[10px] cursor-pointer"
                  onClick={() => {
                    handleShowEdit(item._id); // Directly call the function with the item ID
                    setUpdatedLabel(item.label); // Set the current values in the form
                    setUpdatedDate(item.date);
                    setUpdatedAmount(item.value);
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {showEdit && (
          <div className="absolute z-[999] flex flex-col p-[10px] top-[25px] right-0 h-[500px] w-[500px] bg-white shadow-xl">
            <FaWindowClose
              className="flex justify-end items-end text-2xl text-red-500 cursor-pointer"
              onClick={() => setShowEdit(false)}
            />
            <label htmlFor="" className="mt-[10px] font-semibold text-[18px]">
              Expense Name
            </label>
            <input
              type="text"
              value={updatedLabel}
              className="outline-none border-2 border-[#555] border-solid p-[10px]"
              onChange={(e) => setUpdatedLabel(e.target.value)}
            />
            <label htmlFor="" className="mt-[10px] font-semibold text-[18px]">
              Expense Date
            </label>
            <input
              type="date"
              value={updatedDate}
              className="outline-none border-2 border-[#555] border-solid p-[10px]"
              onChange={(e) => setUpdatedDate(e.target.value)}
            />
            <label htmlFor="" className="mt-[10px] font-semibold text-[18px]">
              Expense Amount
            </label>
            <input
              type="number"
              value={updatedAmount}
              className="outline-none border-2 border-[#555] border-solid p-[10px]"
              onChange={(e) => setUpdatedAmount(e.target.value)}
            />

            <button
              className="bg-[#af8978] text-white p-[10px] border-none cursor-pointer my-[10px]"
              onClick={handleUpdateExpense}
            >
              Update Expense
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
