import { Router } from 'express';
import Material from '../models/Material.js';
import Transaction from '../models/Transaction.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const [totalMaterials, outOfStock, accepted, rejected, recent] = await Promise.all([
      Material.countDocuments(),
      Material.countDocuments({ availableQty: 0 }),
      Transaction.countDocuments({ status: 'Accepted' }),
      Transaction.countDocuments({ status: 'Rejected' }),
      Transaction.find({ status: 'Accepted' }).sort({ date: -1, createdAt: -1 }).limit(5),
    ]);
    res.json({ totalMaterials, outOfStock, accepted, rejected, recent });
  } catch (e) { next(e); }
});

export default router;
