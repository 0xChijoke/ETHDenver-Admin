import { useState, useEffect } from "react";
import { db } from "~~/pages/api/config";
import "firebase/firestore";
import { Address } from "./scaffold-eth";
import { pay } from "~~/helpers/pay";
import { buidlContract } from "~~/pages";
import { formatUnits } from "ethers/lib/utils";
import Spinner from "./Spinner";
import Link from "next/link";
import { useRouter } from "next/router";
import _ from "lodash";

export interface Vendor {
  id: string;
  name: string;
  address: string;
  balance: number;
  transactions: Transaction[];
  totalOrders: number;
  userCount: number;
  unpaidTotal: number;
  paidTotal: number;
}

export interface Transaction {
  from: string;
  to: string;
  value: number;
  timestamp: Date;
  isPaid: boolean;
}

const VendorAddresses = () => {
  const router = useRouter();
  // Define state variables for vendor data and modal
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Define state variables for the form data
  const [newVendor, setNewVendor] = useState<Vendor>({
    id: "",
    name: "",
    address: "",
    balance: 0,
    transactions: [],
    totalOrders: 0,
    userCount: 0,
    unpaidTotal: 0,
    paidTotal: 0,
  });

  // Define a function to fetch vendor data from the database
  const fetchVendors = async () => {
    setLoading(true);
    const querySnapshot = await db.collection("vendors").get();

    const vendorData: Vendor[] = [];

    for (const doc of querySnapshot.docs) {
      const vendor = doc.data() as Vendor;

      // Fetch transactions for the vendor
      const transactionSnapshot = await db.collection("transactions").where("to", "==", vendor.address).get();
      const transactions: Transaction[] = [];

      let paidTotal = 0;
      let unpaidTotal = 0;
      let totalOrders = 0;

      transactionSnapshot.forEach(doc => {
        const transaction = doc.data() as Transaction;

        // Calculate the paid and unpaid amounts for the transaction
        if (transaction.isPaid) {
          paidTotal += Number(transaction.value);
        } else {
          unpaidTotal += Number(transaction.value);
        }

        transactions.push(transaction);
        totalOrders++;
      });

      const userCount = _.uniqBy(transactions, "from").length;

      const balance = await buidlContract.balanceOf(vendor.address);

      vendorData.push({
        ...vendor,
        id: doc.id,
        balance: Number(formatUnits(balance, 2)),
        transactions: transactions,
        paidTotal: paidTotal,
        unpaidTotal: Math.floor(unpaidTotal),
        totalOrders: Math.floor(totalOrders),
        userCount: userCount,
      });
    }
    setVendors(vendorData);
    setLoading(false);
  };

  // Fetch vendor data when the component mounts
  useEffect(() => {
    fetchVendors();
  }, []);

  // Define a function to add a new vendor to the database
  const addVendor = async () => {
    const docRef = await db.collection("vendors").add(newVendor);
    setVendors([...vendors, { ...newVendor, id: docRef.id }]);
    setNewVendor({
      id: "",
      name: "",
      address: "",
      balance: 0,
      transactions: [],
      totalOrders: 0,
      userCount: 0,
      unpaidTotal: 0,
      paidTotal: 0,
    });
    await fetchVendors();
  };

  const deleteVendor = async (vendor: Vendor) => {
    await db.collection("vendors").doc(vendor.id).delete();

    // Delete the corresponding transactions
    const transactionsSnapshot = await db.collection("transactions").where("to", "==", vendor.address).get();
    transactionsSnapshot.forEach(async doc => {
      await db.collection("transactions").doc(doc.id).delete();
    });

    const updatedVendors = vendors.filter(v => v.id !== vendor.id);
    setVendors(updatedVendors);

    // Reload the window
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="items-center flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between">
        <h2 className="font-bold uppercase tracking-widest text-white">Vendor Details</h2>
        {/* Button to show the modal */}
        <div className="space-x-3">
          <Link href={"/payouts"}>
            <button className="btn bg-blue-800 rounded-lg py-0 border-blue-900 px-3 mb-1">View payout</button>
          </Link>
          <label className="btn bg-blue-800 rounded-lg py-0 border-blue-900 px-3 mb-1" htmlFor="create-modal">
            Add Vendor
          </label>
        </div>
      </div>

      {/* Modal to add a new vendor */}
      <input type="checkbox" id="create-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <label htmlFor="create-modal" className="btn btn-square absolute right-2 top-2">
            ✕
          </label>
          <h3 className="text-lg font-bold">Add Vendor</h3>
          <div className="modal-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                className="input input-bordered"
                type="text"
                value={newVendor.name}
                onChange={e => setNewVendor({ ...newVendor, name: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <input
                className="input input-bordered"
                type="text"
                value={newVendor.address}
                onChange={e => setNewVendor({ ...newVendor, address: e.target.value })}
              />
            </div>
          </div>
          <div className="modal-footer space-y-4 space-x-4">
            <button className="btn btn-primary" onClick={addVendor}>
              Add
            </button>
            <label className="btn" htmlFor="create-modal">
              Cancel
            </label>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-scroll md:overflow-auto">
        {/* Table to display vendor data */}
        <table className="table table-compact text-center overflow-x-scroll table-striped w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>User Count</th>
              <th>Balance</th>
              <th>Unpaid (BUIDL)</th>
              <th>Paid ($)</th>
              <th>Total Orders</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map(vendor => (
              <tr key={vendor.id}>
                <td>{vendor.name}</td>
                <td>
                  <Address address={vendor.address} />
                </td>
                <td>{vendor.userCount}</td>
                <td>{vendor.balance}</td>
                <td>{vendor.unpaidTotal}</td>
                <td>{vendor.paidTotal}</td>
                <td>{vendor.totalOrders}</td>
                <td className="space-x-4">
                  {/* Button to mark all unpaid transactions as paid */}
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to mark all unpaid transactions for ${vendor.name} as paid?`,
                        )
                      ) {
                        pay(vendor, router);
                      }
                    }}
                  >
                    Pay
                  </button>

                  {/* Button to delete the vendor */}
                  <button
                    className="btn btn-sm btn-error mr-2"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete ${vendor.name}?`)) {
                        deleteVendor(vendor);
                      }
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorAddresses;
