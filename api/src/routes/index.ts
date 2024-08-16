import middleware from '@blocklet/sdk/lib/middlewares';
import { Router } from 'express';
import { getDatabase } from '../db';

const router = Router();

router.use('/user', middleware.user(), (req, res) => res.json(req.user || {}));

router.use('/data', (_, res) =>
  res.json({
    message: 'Hello Blocklet!',
  }),
);

router.use('/profileData', async (_, res) => {
  const db = getDatabase();
  const sql = 'SELECT * FROM profile_info';
  const rows = await db.all(sql);

  return res.json({
    success: true,
    message: 'success',
    data: rows[0] || {},
  });
});

router.post('/editProfileData', async (req, res) => {
  const db = getDatabase();
  const { id, name, phone, email } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID is required' });
  }
  if (!name) {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }

  try {
    const sql = 'UPDATE profile_info SET name = ?, phone = ?, email = ? WHERE id = ?';
    const result = await db.run(sql, [name, phone, email, id]);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    return res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default router;
