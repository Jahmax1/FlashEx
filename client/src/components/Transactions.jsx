import { useEffect, useState } from "react";
import axios from "axios";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    axios
      .get("/api/transactions")
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error(err));
  }, []);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      <div className="grid gap-4">
        {transactions.map((t) => (
          <div key={t._id} className="p-4 border rounded shadow">
            <p><strong>Fuel Type:</strong> {t.fuelType}</p>
            <p><strong>Volume:</strong> {t.volume} liters</p>
            <p><strong>Tax Amount:</strong> ${t.taxAmount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Transactions;