import { db } from "~~/pages/api/config";
import { Vendor } from "~~/components/VendorAddresses";
import { toast } from "react-hot-toast";
import { NextRouter } from "next/router";

export const pay = async (vendor: Vendor, router: NextRouter | string[]) => {
  try {
    // Query the database for all unpaid transactions for the vendor
    const unpaidTransactionsRef = db
      .collection("transactions")
      .where("to", "==", vendor.address)
      .where("isPaid", "==", false);
    const unpaidTransactionsSnapshot = await unpaidTransactionsRef.get();
    const unpaidTransactions = unpaidTransactionsSnapshot.docs.map(doc => doc.data());

    if (unpaidTransactions.length <= 0) {
      return toast.error(`Vendor ${vendor.name} has no unpaid transactions!`);
    }

    // Show a confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to mark all unpaid transactions for vendor ${vendor.name} as paid?`,
    );

    if (confirmed) {
      toast.promise(
        (async () => {
          // Calculate the total amount of unpaid transactions
          const totalPaidAmount = unpaidTransactions.reduce(
            (total: number, transaction) => total + transaction.value,
            0,
          );
          const numPaidTransactions = unpaidTransactions.length;

          // Update the unpaid transactions to isPaid: true
          const batch = db.batch();
          unpaidTransactionsSnapshot.docs.forEach((transactionDoc: { ref: any }) => {
            batch.update(transactionDoc.ref, { isPaid: true });
          });
          console.log(batch);
          await batch.commit();

          // Store the payout date, total amount, vendor name, and number of paid transactions in the database
          const payoutData = {
            vendor: vendor.name,
            totalAmount: totalPaidAmount.toFixed(2),
            payoutDate: new Date(),
            numPaidTransactions: numPaidTransactions,
          };
          await db.collection("payouts").add(payoutData);

          // Update the vendor's unpaid total and paid total
          const vendorRef = db.collection("vendors").doc(vendor.id);
          const vendorDoc = await vendorRef.get();
          const vendorData = vendorDoc.data() as Vendor;
          const newUnpaidTotal = 0;
          const newPaidTotal = vendorData.paidTotal + totalPaidAmount;
          await vendorRef.update({ unpaidTotal: newUnpaidTotal, paidTotal: newPaidTotal });

          window.location.reload();
          router.push("/payouts"); // push admin to /payouts page
          return `Payment to ${vendor.name} updated successfully!`;
        })(),
        {
          loading: "Updating payment...",
          success: message => message,
          error: "Failed to update payment.",
        },
      );
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong. Please try again later.");
  }
};
