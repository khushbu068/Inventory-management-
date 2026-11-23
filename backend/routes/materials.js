import { Router } from 'express';
import Material, { LOW_STOCK_LIMIT } from '../models/Material.js';
import Transaction from '../models/Transaction.js';

const router = Router();
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/materials?search=&unit=&status=out|low|in  (filters combine)
router.get('/', async (req, res, next) => {
  try {
    const { search, unit, status } = req.query;
    const q = {};
    if (search && search.trim()) {
      const rx = new RegExp(escape(search.trim()), 'i');
      q.$or = [{ code: rx }, { name: rx }];
    }
    if (unit && unit !== 'All') q.unit = unit;
    if (status === 'out') q.availableQty = 0;
    if (status === 'low') q.availableQty = { $gt: 0, $lt: LOW_STOCK_LIMIT };
    if (status === 'in') q.availableQty = { $gte: LOW_STOCK_LIMIT };

    const [materials, total] = await Promise.all([
      Material.find(q).sort({ code: 1 }),
      Material.countDocuments(),
    ]);
    res.json({ materials, total });
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found.' });
    const hasTransactions = !!(await Transaction.exists({ material: material._id, status: 'Accepted' }));
    res.json({ ...material.toObject(), hasTransactions });
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { code, name, unit } = req.body;
    const openingQty = Number(req.body.openingQty ?? 0);
    const material = await Material.create({ code, name, unit, openingQty, availableQty: openingQty });
    res.status(201).json(material);
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found.' });

    if (req.body.name !== undefined) material.name = req.body.name;
    if (req.body.unit !== undefined) material.unit = req.body.unit;

    if (req.body.openingQty !== undefined && Number(req.body.openingQty) !== material.openingQty) {
      const locked = await Transaction.exists({ material: material._id, status: 'Accepted' });
      if (locked) {
        return res.status(400).json({ message: 'Opening quantity is locked once transactions exist.' });
      }
      material.openingQty = Number(req.body.openingQty);
      material.availableQty = Number(req.body.openingQty);
    }
    await material.save();
    res.json(material);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const used = await Transaction.exists({ material: req.params.id, status: 'Accepted' });
    if (used) {
      return res.status(409).json({ message: 'Cannot delete a material that has transaction history.' });
    }
    await Material.findByIdAndDelete(req.params.id);
    await Transaction.deleteMany({ material: req.params.id }); // only rejected logs remain here
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
});

export default router;
