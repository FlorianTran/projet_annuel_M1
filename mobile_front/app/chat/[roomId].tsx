import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useUser } from '../context/UserContext';
import MessageBubble from '../../components/MessageBubble';
import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { User } from '@/lib/models/user';
import { Message } from '@/lib/models/message';
import { getChatroomById, getMessagesByRoom, sendMessage as sendMessageAPI } from '@/lib/api/chat';
import { socketService} from '@/lib/socket';

export default function Chat() {
  const { roomId } = useLocalSearchParams();
  const validRoomId = typeof roomId === 'string' ? roomId : Array.isArray(roomId) ? roomId[0] : undefined;
  const { user } = useUser();

  const [roomName, setRoomName] = useState('');
  const [roomUsers, setRoomUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const fetchRoomInfo = async () => {
    try {
      if (!validRoomId) return;
      const data = await getChatroomById(validRoomId);
      setRoomName(data.nom);
      setRoomUsers(data.utilisateurs);
    } catch (err) {
      console.error('Erreur récupération chatroom :', err);
      Alert.alert('Erreur', 'Impossible de charger les informations du salon.');
    }
  };

  const fetchMessages = async () => {
    try {
      if (!validRoomId) return;
      const messages = await getMessagesByRoom(validRoomId);
      console.log('Messages récupérés :', messages);
      setMessages(messages.reverse());
    } catch (err) {
      console.error('Erreur récupération messages :', err);
      Alert.alert('Erreur', 'Impossible de charger les messages.');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !validRoomId) return;

    const localMessage: Message = {
      id: `local-${Date.now()}`, // id temporaire
      content: newMessage,
      chatroomId: validRoomId,
      userId: user.id,
      createdAt: new Date().toISOString(),
      user: user,
    };

    // Affichage immédiat
    setMessages((prev) => [...prev, localMessage]);
    setNewMessage('');

    try {
      // Enregistrement via API
      await sendMessageAPI(newMessage, validRoomId, user.id);

      // Notification socket
      socketService.getSocket().emit('sendMessage', {
        content: newMessage,
        chatroomId: validRoomId,
        userId: user.id,
      });
    } catch (err) {
      console.error('Erreur envoi message :', err);
      Alert.alert('Erreur', 'Message non envoyé au serveur.');
    }
  };


  useEffect(() => {
    if (!user || !validRoomId) return;

    const socket = socketService.connect();
    socket.emit('registerUser', { user });
    socket.emit('joinRoom', { chatroomId: validRoomId });

    fetchRoomInfo();
    fetchMessages();

    const handleNewMessage = (message: Message) => {
      if (message.chatroomId === validRoomId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.emit('leaveRoom', { chatroomId: validRoomId });
      socket.off('newMessage', handleNewMessage);
    };
  }, [user, validRoomId]);

  if (!validRoomId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Identifiant de salon invalide.</Text>
      </View>
    );
  }

  const getDateLabel = (dateString: string): string => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Aujourd’hui';
    if (isYesterday(date)) return 'Hier';
    return format(date, 'dd MMMM yyyy', { locale: fr });
  };

  const groupedMessages: { date: string; messages: Message[] }[] = [];
  messages.forEach((msg) => {
    const label = getDateLabel(msg.createdAt);
    const lastGroup = groupedMessages[groupedMessages.length - 1];
    if (!lastGroup || lastGroup.date !== label) {
      groupedMessages.push({ date: label, messages: [msg] });
    } else {
      lastGroup.messages.push(msg);
    }
  });

  type FlattenedItem =
    | { type: 'separator'; label: string }
    | (Message & { type: 'message' });

  const flattened: FlattenedItem[] = groupedMessages.flatMap((group) => [
    { type: 'separator', label: group.date },
    ...group.messages.map((m) => ({ ...m, type: 'message' as const })),
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salon : {roomName}</Text>
      <Text style={styles.subtitle}>
        Membres : {roomUsers.map((u) => `${u.prenom} ${u.nom}`).join(', ') || 'Aucun membre'}
      </Text>

      <FlatList
        data={flattened}
        keyExtractor={(item, index) =>
          item.type === 'separator'
            ? `sep-${(item as { label: string }).label}-${index}`
            : (item as { id: string }).id
        }
        renderItem={({ item }) => {
          if (item.type === 'separator' && 'label' in item) {
            return (
              <View style={styles.dateSeparator}>
                <Text style={styles.dateSeparatorText}>{item.label}</Text>
              </View>
            );
          }

          if ('content' in item && 'createdAt' in item) {
            return (
              <MessageBubble
                content={item.content}
                sender={item.user?.prenom ?? 'Inconnu'}
                isMine={item.user?.id === user?.id}
                timestamp={new Date(item.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              />
            );
          }
          return null;
        }}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Votre message..."
        style={styles.input}
      />
      <Button title="Envoyer" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: 16,
    color: 'red',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 12,
    color: '#555',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateSeparatorText: {
    fontSize: 13,
    color: '#666',
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  message: {
    backgroundColor: '#f1f1f1',
    padding: 8,
    marginBottom: 4,
    borderRadius: 4,
  },
  myMessage: {
    backgroundColor: '#d1e7ff',
    padding: 8,
    marginBottom: 4,
    alignSelf: 'flex-end',
    borderRadius: 4,
  },
});
