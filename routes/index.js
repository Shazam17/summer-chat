const express = require('express');
const {User_Dialog} = require("../migrations");
const {Dialog} = require("../migrations");
const {Message} = require("../migrations");
const router = express.Router();

router.get('/', (req, res) => {
  res.json({success: true})
})

router.post('/create-chat',async (req, res) => {
  try {
    const {userId, title} = req.body;
    const dialog = await Dialog.create({
      title: title ? title : 'Новый диалог'
    })
    await User_Dialog.create({
      user_id: userId,
      dialog_id: dialog.id
    })
    res.json(dialog)
  }catch (e) {
    res.json({error: e})
  }
})

router.get('/get-chats', async (req, res) => {
  try {
    const {userId} = req.body;

    const userDialogs = await User_Dialog.findAll({where: {
      user_id:userId
      }})
    const chats = await Promise.all(
        userDialogs.map(async (item) => {
          return Dialog.findOne({where: {id: item.dialog_id}})
    }))
    res.json({chats})
  }catch (e) {
    res.json({error: e})
  }
})

router.get('/get-chat', async (req, res) => {
  try {

  }catch (e) {
    res.json({error: e})
  }
})

router.post('/edit-chat', async(req, res) => {
  try {

  }catch (e) {
    res.json({error: e})
  }
})

router.post('/delete-chat', async (req, res) => {
  try {
    const {userId} = req.body;
    const userDialog = await User_Dialog.findOne({where: {
        user_id:userId
      }})
    await userDialog.destroy()
    res.json({success: true})
  }catch (e) {
    res.json({error: e})
  }
})

router.get('/get-messages', async (req, res) => {
  try {
    const {chat_id} = req.body;
    const messages = Message.findAll({where: {chat_id}})
    res.json({messages})
  } catch (e) {
    res.json({error: e})

  }
})

router.post('/send-message', async (req, res) => {
  try {
    const {text,
      is_outgoing,
      user_id,
      chat_id} = req.body;
    const message = await Message.create({
      text,
      is_outgoing,
      user_id,
      chat_id
    })
    res.json({message})
  }catch (e) {
    res.json({error: e})
  }
})






module.exports = router;
