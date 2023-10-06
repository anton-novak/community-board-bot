const { Router } = require('express'); // just to get the Router prop from express, rather than the whole package
const { getAllAdsController, getTelegramPic } = require('./controllers.js');
const { validateTelegramHash } = require('./middleware.js');
const router = Router();


// const messageController = require('./controllers/message.controller.js');

router.get('/ads/:checkString', validateTelegramHash, getAllAdsController);
router.get('/pics/:checkString/:file_id', validateTelegramHash, getTelegramPic);

// router.post('/messages', () => {}); 
// router.put('/messages/:id', messageController.postMessages); 
// router.delete('/messages/:id', messageController.postMessages); 
// router.get('/messages/:id', messageController.postMessages); 

// A CRUD convention → 5 endpoints. Read about it!

module.exports = router;