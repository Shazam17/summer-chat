
const io = require("socket.io")(server);

class SocketWrapper {
    users = [];
    connnections = [];

    constructor(io) {
        this.io = io;

        this.io.on('connection', function(socket) {
            console.log('A user connected');

            socket.on('disconnect', function () {
                console.log('A user disconnected');
            });

            socket.on('add_friend',  async (params) => {
                console.log(params);
                const {id1, id2} = params

                await User_Friends.create({
                    user_id1: id1,
                    user_id2: id2
                })

                await User_Friends.create({
                    user_id1: id2,
                    user_id2: id1
                })

                const friend = User.findOne({where: {id: id2}})

                socket.broadcast.emit("new_friend", {id1, friend});
                socket.emit("new_friend", {id1,friend});
            });

            socket.on('remove_friend',  async (params) => {
                console.log('remove');
                let user = await User.findOne({where: {id: params.id}});
                user.friends = user.friends.filter((friend) => friend !== params.friend_id);
                user.save();
            });

            socket.on('create_chat', async (params) => {
                const dialog = await Dialog.create({
                    title: '',
                    members_ids: [params.id, params.friend_id]
                })
                let user = await User.findOne({where: {id: params.id}});
                user.dialogs = [...user.dialogs, dialog.id];
                await user.save();

                let friend = await User.findOne({where: {id: params.friend_id}});
                friend.dialogs = [...friend.dialogs, dialog.id];
                await friend.save();
                console.log(dialog);
            })

            socket.on('send_message', async (params) =>
            {
                const message = await Message.create({
                    owner_id: params.id,
                    chat_id: params.chat_id,
                    text: params.text,
                    attachment: params.attachment
                })
                console.log("Send message")
                socket.broadcast.emit("new_message", message);
                socket.emit("new_message", message);

            })

            socket.on('a', async (params) => {
                await User_Group.create({
                    user_id: params.id,
                    group_id: params.group_id
                })
            })

            socket.on('add_group', async (params) => {
                const group = await Group.create({
                    title: params.title,
                    admin_id: params.id
                })
                await User_Group.create({
                    user_id: params.id,
                    group_id: group.id
                })
                socket.broadcast.emit("new_group", {group, id: params.id});
                socket.emit("new_group", {group, id: params.id});
            })

            // socket.on('post_create', async (params) => {
            //     const post = await User_Post.create({
            //         title: params.title,
            //         content: params.content,
            //         group_id: params.isGroup ? params.id : null,
            //         owner_id: !params.isGroup ? params.id : null
            //     })
            //
            //     socket.broadcast.emit("new_post", post);
            //     socket.emit("new_post", post);
            // })

            socket.on('post_create', async (params) => {
                let {id, content, title, isGroup} = params;

                const post = await User_Post.create({
                    title: title,
                    content: content,
                    group_id: isGroup ? id : null,
                    user_id: !isGroup ? id : null
                })
                socket.broadcast.emit("new_post", {post, id});
                socket.emit("new_post", {post, id});
            })

            socket.on('comment_create', async (params) => {
                let comment = await CommentModel.create({
                    text: params.text,
                    owner_id: params.id,
                    post_id: params.post_id
                })
                comment.dataValues.owner = await User.findOne({where:{id: params.id}})
                socket.broadcast.emit("new_comment", comment);
                socket.emit("new_comment", comment);
            })

            socket.on('modify', async (params) => {
                let user = await User.findOne({where: {id: params.id}});
                user.dialogs = [];
                await user.save();
            })
        });
    }


}

module.exports = SocketWrapper;
