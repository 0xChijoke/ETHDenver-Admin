import { useState } from "react";
import { db } from "~~/pages/api/config";
import firebase from "firebase";

interface Transaction {
  id: string;
  from: string;
  vendor: string;
  amount: number;
  timestamp: Date;
  paid: boolean;
}

const SearchTransaction = () => {
  const [vendor, setVendor] = useState("");
  const [from, setFrom] = useState("");
  const [datetime, setDatetime] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleVendorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVendor(e.target.value);
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFrom(e.target.value);
  };

  const handleDatetimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatetime(e.target.value);
  };

  const handleSearch = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let query: firebase.firestore.CollectionReference<Transaction> = db.collection("transactions");

    if (vendor) {
      query = query.where("vendor", "==", vendor);
    }

    if (from) {
      query = query.where("from", "==", from);
    }

    if (datetime) {
      const timestamp = new Date(datetime);
      query = query.where("timestamp", ">=", timestamp);
    }

    query = query.orderBy("timestamp", "desc");

    const querySnapshot = await query.get();

    const results: Transaction[] = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      results.push({
        id: doc.id,
        from: data.from,
        vendor: data.vendor,
        amount: data.amount,
        timestamp: data.timestamp.toDate(),
        paid: data.paid,
      });
    });

    setTransactions(results);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <h2 className="mb-4 text-lg font-bold">Search Transactions</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="vendor">
            Vendor Address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="vendor"
            type="text"
            placeholder="Enter vendor address"
            value={vendor}
            onChange={handleVendorChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="from">
            From Address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="from"
            type="text"
            placeholder="Enter from address"
            value={from}
            onChange={handleFromChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="datetime">
            Date/Time
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="datetime"
            type="datetime-local"
            placeholder="Select date/time"
            value={datetime}
            onChange={handleDatetimeChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
      {transactions.length > 0 ? (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
          <h2 className="mb-4 text-lg font-bold">Results</h2>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">From Address</th>
                <th className="px-4 py-2">Vendor Address</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Timestamp</th>
                <th className="px-4 py-2">Paid</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="border px-4 py-2">{transaction.id}</td>
                  <td className="border px-4 py-2">{transaction.from}</td>
                  <td className="border px-4 py-2">{transaction.vendor}</td>
                  <td className="border px-4 py-2">{transaction.amount}</td>
                  <td className="border px-4 py-2">{transaction.timestamp.toISOString()}</td>
                  <td className="border px-4 py-2">{transaction.paid ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default SearchTransaction;
