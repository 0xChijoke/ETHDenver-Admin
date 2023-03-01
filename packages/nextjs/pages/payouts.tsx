import { useEffect, useState } from "react";
import { db } from "~~/pages/api/config";

type Payout = {
  id: string;
  vendor: string;
  totalAmount: number;
  payoutDate: Date;
  numPaidTransactions: number;
};

const PayoutsTable = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);

  useEffect(() => {
    const fetchPayouts = async () => {
      const payoutsData: Payout[] = [];
      const payoutsSnapshot = await db.collection("payouts").get();
      payoutsSnapshot.forEach(doc => {
        const data = doc.data();
        payoutsData.push({
          id: doc.id,
          vendor: data.vendor,
          totalAmount: data.totalAmount,
          payoutDate: data.payoutDate.toDate(),
          numPaidTransactions: data.numPaidTransactions,
        });
      });
      setPayouts(payoutsData);
    };
    fetchPayouts();
  }, []);

  return (
    <div className="overflow-x-scroll md:overflow-auto w-full">
      <table className="table table-compact text-center overflow-x-scroll table-striped w-full">
        <thead>
          <tr>
            <th>Vendor</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Num of Paid Txns</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map(payout => (
            <tr key={payout.id}>
              <td>{payout.vendor}</td>
              <td>{payout.totalAmount}</td>
              <td>{payout.payoutDate.toLocaleDateString()}</td>
              <td>{payout.numPaidTransactions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayoutsTable;
