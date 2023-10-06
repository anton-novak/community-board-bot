import { Router } from 'express';
import { getAllAdsController, getTelegramPic, /* saveAd */ } from './controllers';
import validateTelegramHash from './middleware';
export const router = Router();

router.get('/ads/:checkString', validateTelegramHash, getAllAdsController);
router.get('/pics/:checkString/:file_id', validateTelegramHash, getTelegramPic);
// router.get('/save/:checkString/:_id', validateTelegramHash, saveAd);