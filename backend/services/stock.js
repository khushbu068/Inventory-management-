import Material from '../models/Material.js';
import Transaction from '../models/Transaction.js';

const httpError = (status, message) => Object.assign(new Error(message), { status });

/**
 * Posts an inward/outward entry.
 * Outward uses a conditional atomic update (availableQty >= qty), so stock can
 * never go negative, even with concurrent requests.
 * A rejected outward is logged as 'Rejected' (counted on the dashboard,
 * never shown in history) and the balance is left unchanged.
 */
export async function postTransaction({ materialId, type, qty, date, reference }) {
  qty = Number(qty);
  if (!materialId) throw httpError(400, 'Select a material.');
  if (!['Inward', 'Outward'].includes(type)) throw httpError(400, 'Invalid transaction type.');
  if (!Number.isFinite(qty) || qty <= 0) throw httpError(400, 'Quantity must be greater than zero.');
  if (!date) throw httpError(400, 'Date is required.');
  if (!reference || !reference.trim()) throw httpError(400, 'Reference is required.');

  const material = await Material.findById(materialId);
  if (!material) throw httpError(404, 'Material not found.');

  const filter = { _id: materialId };
  if (type === 'Outward') filter.availableQty = { $gte: qty };

  const updated = await Material.findOneAndUpdate(
    filter,
    { $inc: { availableQty: type === 'Inward' ? qty : -qty } },
    { new: true }
  );

  const base = { material: material._id, code: material.code, type, qty, date, reference: reference.trim() };

  if (!updated) {
    const message = `Issue rejected. Requested quantity ${qty} exceeds available quantity ${material.availableQty} for ${material.code} (${material.name}). No stock was changed.`;
    await Transaction.create({ ...base, status: 'Rejected', balanceAfter: material.availableQty, reason: message });
    throw httpError(422, message);
  }

  return Transaction.create({ ...base, status: 'Accepted', balanceAfter: updated.availableQty });
}
