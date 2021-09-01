const express = require('express');
const {User_Dialog} = require("../migrations");
const {Dialog} = require("../migrations");
const {Message} = require("../migrations");
const router = express.Router();

let updates = [];

const UPDATE_TYPES = {
  SEND_MESSAGE: "SEND-MESSAGE",
  NEW_CHAT: "NEW_CHAT",
  DELETE_CHAT: "DELETE_CHAT"
}

const pushUpdate = (id, type, payload) => {
  updates.push({id, type, payload})
}


router.post('/updates', (req, res) => {
  const {id} = req.body;
  const targetUpdates = updates.filter((item) => item.id === id)
  updates = updates.filter((item) => item.id !== id)

  res.json({targetUpdates})
})

router.get('/', (req, res) => {
  res.json({success: true})
})

router.post('/create-chat',async (req, res) => {
  try {
    const {user_id, title} = req.body;
    const dialog = await Dialog.create({
      title: title ? title : 'Новый диалог'
    })
     await User_Dialog.create({
      user_id: user_id,
      dialog_id: dialog.id
    })
    console.log(user_id)
    pushUpdate(user_id,UPDATE_TYPES.NEW_CHAT, dialog)
    res.json(dialog)
  }catch (e) {
    res.json({error: e})
  }
})

router.get('/get-chats', async (req, res) => {
  try {
    const {user_id} = req.body;

    const userDialogs = await User_Dialog.findAll({where: {
      user_id
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
    const {user_id, chat_id} = req.body;
    const dialogId = chat_id
    const userId = user_id
    const dialog = await Dialog.findOne({
      where: {
        id: dialogId
      }
    })
    const userDialogs = await User_Dialog.findAll({where: {
        dialog_id: dialogId
      }})
    await Promise.all(userDialogs.map( async (item) => {
      await item.destroy();
    }))
    await dialog.destroy()
    pushUpdate(userId,UPDATE_TYPES.DELETE_CHAT,dialog)
    res.json({success: true})
  }catch (e) {
    res.json({error: e})
  }
})

router.get('/get-messages', async (req, res) => {
  try {
    const {chat_id} = req.body;
    const messages = await Message.findAll({where: {chat_id}})
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

    pushUpdate(user_id,UPDATE_TYPES.SEND_MESSAGE,message)

    res.json({message})
  }catch (e) {
    res.json({error: e})
  }
})






module.exports = router;
