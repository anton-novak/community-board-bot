const { Router } = require('express'); // just to get the Router prop from express, rather than the whole package
const router = Router();

// const messageController = require('./controllers/message.controller.js');

router.get('/messages', () => {}); // no need to pass (req, res) or call it, Express will do it for us
router.post('/messages', () => {}); 
// router.put('/messages/:id', messageController.postMessages); 
// router.delete('/messages/:id', messageController.postMessages); 
// router.get('/messages/:id', messageController.postMessages); 

// A CRUD convention → 5 endpoints. Read about it!

module.exports = router;