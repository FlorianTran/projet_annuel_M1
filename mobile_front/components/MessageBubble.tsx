import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MessageBubbleProps {
  content: string;
  sender: string;
  isMine: boolean;
  timestamp?: string;
}

export default function MessageBubble({ content, sender, isMine, timestamp }: MessageBubbleProps) {
  return (
    <View style={[styles.container, isMine ? styles.mine : styles.their]}>
      <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheir]}>
        {!isMine && <Text style={styles.sender}>{sender}</Text>}
        <Text style={styles.content}>{content}</Text>
        {timestamp && <Text style={styles.time}>{timestamp}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  mine: {
    justifyContent: 'flex-end',
  },
  their: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 16,
  },
  bubbleMine: {
    backgroundColor: '#DCF8C6', // vert WhatsApp
    borderTopRightRadius: 4,
  },
  bubbleTheir: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sender: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 2,
    color: '#075E54', // vert foncé
  },
  content: {
    fontSize: 16,
    color: '#000',
  },
  time: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
});
