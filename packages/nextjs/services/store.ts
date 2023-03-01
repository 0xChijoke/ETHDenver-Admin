import { makeAutoObservable, action } from "mobx";
import moment from "moment";
import { db } from "~~/pages/api/config";
import { Transaction, Vendor } from "../components/VendorAddresses";

class VendorStore {
  vendors: Vendor[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setVendors(vendors: Vendor[]) {
    this.vendors = vendors;
  }
  @action
  addVendor(vendor: Vendor) {
    this.vendors.push(vendor);
  }
}

class TransactionStore {
  transactions: Transaction[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setTransactions(transactions: Transaction[]) {
    this.transactions = transactions;
  }
  @action
  setTransactionPaid(transactionTo: string, isPaid: boolean) {
    const transaction = this.transactions.find(t => t.to === transactionTo);
    if (transaction) {
      transaction.isPaid = isPaid;
    }
  }
}

class VendorTransactionStore {
  vendorStore: VendorStore;
  transactionStore: TransactionStore;

  constructor() {
    this.vendorStore = new VendorStore();
    this.transactionStore = new TransactionStore();
  }
}

const vendorTransactionStore = new VendorTransactionStore();

db.collection("vendors").onSnapshot(snapshot => {
  const vendors: Vendor[] = [];

  snapshot.forEach(doc => {
    const vendorData = doc.data();
    vendors.push({
      id: doc.id,
      name: vendorData.name,
      address: vendorData.address,
      balance: vendorData.balance,
      transactions: [...vendorData.transactions],
      totalOrders: vendorData.totalOrders,
      userCount: vendorData.userCount,
      unpaidTotal: vendorData.unpaidTotal,
      paidTotal: vendorData.paidTotal,
    });
  });

  vendorTransactionStore.vendorStore.setVendors(vendors);
});

db.collection("transactions").onSnapshot(snapshot => {
  const transactions: Transaction[] = [];

  snapshot.forEach(doc => {
    const transactionData = doc.data();
    const date = moment(transactionData.timestamp);
    transactions.push({
      from: transactionData.from,
      to: transactionData.to,
      value: transactionData.value,
      timestamp: date.toDate(),
      isPaid: transactionData.isPaid,
    });
  });

  vendorTransactionStore.transactionStore.setTransactions(transactions);
});

export default vendorTransactionStore;
