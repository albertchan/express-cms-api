import express from 'express';

const router = express.Router();

// Logger
router.use((req, res, next) => {
  console.log('[API]:', req.url);

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

export default router;
