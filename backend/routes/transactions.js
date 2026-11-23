import { Router } from 'express';
import Material from '../models/Material.js';
import Transaction from '../models/Transaction.js';
import { postTransaction } from '../services/stock.js';

const router = Router();
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/transactions?material=&type=&from=&to=  (accepted only, date order)
router.get('/', async (req, res, next) => {
  try {
    const { material, type, from, to } = req.query;
    const q = { status: 'Accepted' };

    if (material && material.trim()) {
      const rx = new RegExp(escape(material.trim()), 'i');
      const ids = await Material.find({ $or: [{ code: rx }, { name: rx }] }).distinct('_id');
      q.material = { $in: ids };
    }
    if (type && type !== 'All') q.type = type;
    if (from || to) {
      q.date = {};
      if (from) q.date.$gte = from;
      if (to) q.date.$lte = to;
    }
    res.json(await Transaction.find(q).sort({ date: 1, createdAt: 1 }));
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    res.status(201).json(await postTransaction(req.body));
  } catch (e) { next(e); }
});

export default router;
