// import { useEffect, useState } from "react";
// import { formatUnits } from "@ethersproject/units";
// import { Contract, ethers } from "ethers";
// import { useAccount } from "wagmi";
// import _ from "lodash";
// import { db } from "~~/pages/api/config";

// import ERC20ABI from "~~/abi/ERC20.json" assert { type: "json" };

//   const provider = new ethers.providers.JsonRpcProvider('https://zksync2-testnet.zksync.dev')
//   const { address } = useAccount();
//   const signer = provider.getSigner(address);
//   const buidlTokenAddress = "0xf551954D449eA3Ae4D6A2656a42d9B9081B137b4";
//   const vendorAddresses = ["0x0dc01C03207fB73937B4aC88d840fBBB32e8026d", "0x7EBa38e027Fa14ecCd87B8c56a49Fa75E04e7B6e"];
//   export const buidlContract = new Contract(buidlTokenAddress, ERC20ABI, signer);
// const Vendors = () => {
//   const [vendorData, setVendorData] = useState<Vendor[]>()

//   // Event listener
//   const update = buidlContract.on('Transfer', async () => {
//     getTransactions();
//   });

//   // Update on event listener
//   useEffect(() => {
//     getTransactions();
//     return () => {
//       update.removeAllListeners();
//     };
//   }, []);

//   // Fetches and buckets transfer events
//   async function getTransactions() {
//     let vendors: Vendor[] = [];

//     for (let i = 0; i < vendorAddresses.length; i++) {
//       let balance = (await buidlContract.balanceOf(vendorAddresses[i])).toNumber() / 100;
//       vendors.push({
//         address: vendorAddresses[i],
//         id: i,
//         transactions: [],
//         balance: balance,
//         userCount: 0,
//         totalOrders: 0,
//         currentToBlock: 0,
//         dailyTotal: 0
//       });
//     }

//     const bFilter = buidlContract.filters.Transfer();
//     const block = await provider.getBlockNumber();

//     const transfers = await buidlContract.queryFilter(bFilter, 600, block);

//     for (let t of transfers) {
//       for (let v of vendors) {
//         if (t.args?.to === v.address) {
//           const txData = {
//             from: t.args?.from,
//             to: t.args?.to,
//             value: t.args?.value,
//             timestamp: Date.now(),
//           }
//           v.transactions.push(txData);
//           // Add the transaction to Firestore
//           db.collection("transactions").add(txData)
//             .then(docRef => console.log("Transaction added to Firestore with ID: ", docRef.id))
//             .catch(error => console.error("Error adding transaction to Firestore: ", error));
//         }
//       }
//     }

//     for (let i = 0; i < vendors.length; i++) {
//       const v1uniq = _.uniqBy(vendors[i].transactions, 'from');
//       vendors[i].userCount = v1uniq.length;

//       const ordersPerVendor = vendors[i].transactions.length;

//       vendors[i].totalOrders = ordersPerVendor;

//       // Query the database for any existing transactions for this vendor
//       const existingTransactions = await db
//         .collection('vendors')
//         .doc(vendors[i].address)
//         .collection('transactions')
//         .get();

//       // Calculate daily totals
//       let dailyTotals: number[] = [];
//       let currentDate = new Date();
//       currentDate.setUTCHours(0, 0, 0, 0);

//       for (let j = 0; j < 30; j++) {
//         const dayStart = currentDate.getTime();
//         const dayEnd = dayStart + 86400000;

//         const dayTotal = vendors[i].transactions.reduce((acc, tx) => {
//           const timestamp = tx.timestamp.toNumber() * 1000;

//           if (timestamp >= dayStart && timestamp < dayEnd) {
//             return acc + tx.value.toNumber();
//           } else {
//             return acc;
//           }
//         }, 0);

//         dailyTotals.push(dayTotal);
//         currentDate.setDate(currentDate.getDate() - 1);
//       }

//       // Update vendor data
//       vendors[i].dailyTotals = dailyTotals;
//       vendors[i].currentToBlock = block;

//       // Store transaction data to Firestore
//       const batch = db.batch();
//       const vendorDoc = db.collection('vendors').doc(vendors[i].address);

//       // Update vendor balance
//       batch.update(vendorDoc, { balance: vendors[i].balance });

//       // Store daily totals
//       for (let j = 0; j < 30; j++) {
//         const dayStart = currentDate.getTime();
//         const dayEnd = dayStart + 86400000;

//         const dailyTotalDoc = vendorDoc
//           .collection('dailyTotals')
//           .doc(dayStart.toString());

//         batch.set(dailyTotalDoc, { total: dailyTotals[j] });

//         currentDate.setDate(currentDate.getDate() - 1);
//       }

//     //   // Store individual transactions
//     //   for (let j = 0; j < vendors[i].transactions.length; j++) {
//     //     const tx = vendors[i].transactions[j];
//     //     const txDoc = vendorDoc.collection('transactions').doc(tx.timestamp.toString());
//     //     batch.set(txDoc, tx);
//     //   }

//     //   await batch.commit();
//     // }

//     setVendorData(vendors);
//   }

//   return (
//     <div className="w-full p-4 flex flex-col rounded-2xl bg-blue-900 text-white min-h-full">
//       <div className="w-full ">
//         {/* <p>Buidl contract Balance: BUIDL {buidlTokenBalance}</p>
//         <p>Vendor1 Balance: BUIDL {vendor1Balance}</p>
//         <p>Vendor2 Balance: BUIDL {vendor2Balance}</p> */}
//       </div>
//     </div>
//   );
// };

// export default Vendors;

// const vendorAddresses = ["0x0dc01C03207fB73937B4aC88d840fBBB32e8026d", "0x7EBa38e027Fa14ecCd87B8c56a49Fa75E04e7B6e"];

// async function putTransactions() {
//   let vendors: Vendor[] = [];

//   for (let i = 0; i < vendorAddresses.length; i++) {
//     let balance = (await buidlContract.balanceOf(vendorAddresses[i])).toNumber() / 100;
//     vendors.push({
//       address: vendorAddresses[i],
//       id: i.toString(),
//       transactions: [],
//       balance: balance,
//       userCount: 0,
//       totalOrders: 0,
//       unpaidTotal: 0,
//       paidTotal: 0,
//       name: ''
//     });
//   }

//   const bFilter = buidlContract.filters.Transfer();
//   const block = await provider.getBlockNumber();

//   const transfers = await buidlContract.queryFilter(bFilter, 600, block);

//   for (let t of transfers) {
//     for (let v of vendors) {
//       if (t.args?.to === v.address) {
//         const txData = {
//           from: t.args?.from,
//           to: t.args?.to,
//           value: Number(formatUnits(t.args?.value, 2)),
//           timestamp: new Date(),
//           isPaid: false,
//         }
//         v.transactions.push(txData);
//         // Add the transaction to Firestore
//         db.collection("transactions").add(txData)
//           .then(docRef => console.log("Transaction added to Firestore with ID: ", docRef.id))
//           .catch(error => console.error("Error adding transaction to Firestore: ", error));
//       }
//     }
//   }

//   for (let i = 0; i < vendors.length; i++) {
//     const v1uniq = _.uniqBy(vendors[i].transactions, 'from');
//     vendors[i].userCount = v1uniq.length;

//     const ordersPerVendor = vendors[i].transactions.length;

//     vendors[i].totalOrders = ordersPerVendor;

//     // Query the database for any existing transactions for this vendor
//     const existingTransactions = await db
//       .collection('vendors')
//       .doc(vendors[i].address)
//       .collection('transactions')
//       .get();

//   }
//     }
