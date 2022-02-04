import { database } from '../firebase';
import { useAuth } from '../AuthProvider';

export const useDeleteChat = (chatId, userId) => {
  const { user } = useAuth();
  const deleteChat = () => {
    database.chats
      .doc(chatId)
      .delete()
      .then((res) => {
        removeChatIdFromChatsList();
      })
      .catch((err) => console.log(err));
  };

  const removeChatIdFromChatsList = () => {
    database.users
      .doc(user.id)
      .get()
      .then((doc) => {
        if (!doc.exists) return;
        let chats = [...doc.data().chats];
        for (let i = 0; i < chats.length; i++) {
          if (Object.keys(chats[i])[0] === userId) {
            chats.splice(i, 1);
          }
        }
        doc.ref.update({
          chats: chats,
        });
      });
  };

  return { deleteChat };
};
