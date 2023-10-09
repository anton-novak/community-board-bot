import { Router } from 'express';
import { getAllAdsController, getTelegramPic, getUserAdsController, deleteAdController, saveAdController } from './controllers';
import validateTelegramHash, { establishUser } from './middleware';
export const router = Router();

router.get('/ads/:checkString', validateTelegramHash, getAllAdsController);
router.get('/ads/:checkString/:username', validateTelegramHash, getUserAdsController);
router.get('/pics/:checkString/:file_id', validateTelegramHash, getTelegramPic);
router.delete('/ads/:checkString/:_id', validateTelegramHash, establishUser, deleteAdController);
router.post('/save/:checkString', validateTelegramHash, establishUser, saveAdController);
// Deployment code.
router.get('/', (req, res) => { res.status(200), res.send('Hello World!'); });