import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Material from './models/Material.js';
import Transaction from './models/Transaction.js';
import { postTransaction } from './services/stock.js';

dotenv.config();

// Opening quantities derived from the closing balances in the UI documentation
const materials = [
  { code: 'RM-001', name: 'Steel Sheet 2mm', unit: 'KG', openingQty: 500 },
  { code: 'RM-002', name: 'Aluminium Rod 10mm', unit: 'Meter', openingQty: 300 },
  { code: 'RM-003', name: 'Copper Wire 1.5mm', unit: 'Meter', openingQty: 1200 },
  { code: 'RM-004', name: 'ABS Plastic Granules', unit: 'KG', openingQty: 250 },
  { code: 'RM-005', name: 'Rubber Gasket', unit: 'Nos', openingQty: 150 },
  { code: 'RM-006', name: 'Industrial Paint (Grey)', unit: 'Litre', openingQty: 80 },
  { code: 'RM-007', name: 'Hex Bolt M8', unit: 'Nos', openingQty: 2000 },
  { code: 'RM-008', name: 'Cotton Fabric (Dyed)', unit: 'Meter', openingQty: 400 },
];

// [date, type, code, qty, reference]  (in order, so balances match the document)
const entries = [
  ['2026-12-01', 'Inward', 'RM-001', 200, 'PO-4411'],
  ['2026-12-02', 'Outward', 'RM-004', 300, 'WO-2202'], // REJECTED: only 250 available
  ['2026-12-02', 'Outward', 'RM-001', 150, 'WO-2201'],
  ['2026-12-03', 'Outward', 'RM-004', 100, 'WO-2202'],
  ['2026-12-04', 'Inward', 'RM-002', 50, 'PO-4415'],
  ['2026-12-05', 'Outward', 'RM-005', 150, 'WO-2203'],
  ['2026-12-05', 'Outward', 'RM-005', 50, 'WO-2204'], // REJECTED: nothing left (assumed 2nd rejection)
  ['2026-12-06', 'Inward', 'RM-006', 20, 'PO-4420'],
  ['2026-12-07', 'Outward', 'RM-007', 500, 'WO-2205'],
  ['2026-12-08', 'Outward', 'RM-003', 1200, 'WO-2206'],
  ['2026-12-09', 'Inward', 'RM-008', 100, 'PO-4425'],
];

await mongoose.connect(process.env.MONGO_URI);
await Promise.all([Material.deleteMany(), Transaction.deleteMany()]);

const docs = await Material.insertMany(materials.map((m) => ({ ...m, availableQty: m.openingQty })));
const byCode = Object.fromEntries(docs.map((d) => [d.code, d._id]));

for (const [date, type, code, qty, reference] of entries) {
  try {
    await postTransaction({ materialId: byCode[code], type, qty, date, reference });
  } catch (e) {
    console.log(`Rejected as expected: ${code} ${qty} -> ${e.message}`);
  }
}

console.log('Seed complete');
await mongoose.disconnect();
