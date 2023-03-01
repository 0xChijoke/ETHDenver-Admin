import { Request, Response } from "express";
import { db } from "./config";
import { buidlContract } from "..";
import { Transaction } from "~~/components/VendorAddresses";

async function listenToTransferEvents() {
  const filter = buidlContract.filters.Transfer(null, null);
  buidlContract.on(filter, async (from, to, value) => {
    // Check if the recipient is one of our vendors
    const vendorDoc = await db.collection("vendors").doc(to).get();
    if (!vendorDoc.exists) {
      return;
    }

    const vendorData = vendorDoc.data();
    if (!vendorData) {
      console.log(`Error: Vendor data for ${to} is undefined`);
      return;
    }

    const txData = {
      from,
      to,
      value: value.toNumber(),
      timestamp: Date.now(),
      isPaid: false,
    };

    try {
      // Add the transaction to Firestore
      const transactionRef = await db.collection("transactions").add(txData);
      vendorData.transactions.push({ id: transactionRef.id, ...txData });

      // Update vendor data
      vendorData.balance += value.toNumber() / 100;
      vendorData.totalOrders += 1;

      const uniqueSenders = Array.from(new Set(vendorData.transactions.map((tx: Transaction) => tx.from)));
      vendorData.userCount = uniqueSenders.length;

      const currentDate = new Date();
      currentDate.setUTCHours(0, 0, 0, 0);
      const dayStart = currentDate.getTime();

      const dayTotal = vendorData.transactions
        .filter((tx: Transaction) => !tx.isPaid)
        .reduce((acc: number, tx: Transaction) => {
          const timestamp = Number(tx.timestamp);
          if (timestamp >= dayStart) {
            return acc + tx.value;
          } else {
            return acc;
          }
        }, 0);

      vendorData.dailyTotals = [dayTotal];

      // Update the vendor data in Firestore
      await vendorDoc.ref.update(vendorData);

      console.log("Transaction and vendor data successfully updated in Firestore");
    } catch (error) {
      console.error("Error writing to Firestore: ", error);
    }
  });
}

export default async function handler(req: Request, res: Response) {
  // Initialize Firestore
  console.log("Initializing Firestore...");
  db.settings({});

  // Listen for transfer events
  console.log("Listening for Transfer events...");
  listenToTransferEvents();

  // Return a success response
  res.status(200).json({ message: "Transfer events listener started successfully" });
}
