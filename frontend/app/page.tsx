/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState, useEffect } from 'react';
import { Typography, Avatar, InputBase, Paper } from '@mui/material';
import io from 'socket.io-client';
import UserCard from '@/modules/users/components/UserCard';
import { green } from '@mui/material/colors';
import useUserFetch from '@/modules/users/hooks/useUsers';
import { useAuth } from '@/modules/common/contexts/AuthContext';
import ChatCard from '@/modules/chat/components/ChatCard';

interface Message {
  message: string;
  isReply: boolean;
  timeStamp: string;
  senderUserName: string;
  recipientUsername: string;
}
const socket = io('http://localhost:5000');

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messagesArray, setMessagesArray] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const { userData, loadingUser } = useUserFetch();
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    const savedMessages = localStorage.getItem('messagesArray');
    if (savedMessages) {
      setMessagesArray(JSON.parse(savedMessages));
    }
    socket.on('typing', (data) => {
      setTypingUsers((prev) => [...prev, data.username]);

      setTimeout(() => {
        // Remove user from the typingUsers array
        setTypingUsers((prev) => prev.filter((user) => user !== data.username));
      }, 3000);
    });

    socket.on('connect', () => {
      console.log('Connected to server');
      // Register the user
      socket.emit('register', user?.name);
    });

    socket.on('message', ({ message, senderUsername }) => {
      const data = JSON.parse(message);
      const newMessage = {
        message: data.text,
        isReply: false,
        timeStamp: data.timeStamp,
        senderUserName: senderUsername,
        recipientUsername: user!.name,
      };
      setMessagesArray((prev) => {
        const updatedMessages = [...prev, newMessage];
        // Save updated messages to local storage
        localStorage.setItem('messagesArray', JSON.stringify(updatedMessages));
        return updatedMessages;
      });

    });

    return () => {
      socket.off('message');
      socket.off('typing');
    };
  }, []);

  const sendMessage = () => {
    const data = {
      text: message,
      timeStamp: new Date().toISOString(),
    };
    socket.emit('message', {
      recipientUsername: selectedUser,
      message: JSON.stringify(data),
      senderUsername: user?.name,
    });
    const array = [
      ...messagesArray,
      {
        message,
        isReply: true,
        timeStamp: data.timeStamp,
        senderUserName: user!.name,
        recipientUsername: selectedUser,
      },
    ];
    setMessagesArray(array);
    localStorage.setItem('messagesArray', JSON.stringify(array));
    setMessage('');
  };

  const handleTyping = () => {
    socket.emit('typing', { username: user!.name });
  };

  const filteredArray = messagesArray.filter((message) => {
    if (
      message.senderUserName === user?.name &&
      message.recipientUsername === selectedUser
    ) {
      return true;
    } else if (
      message.recipientUsername === user?.name &&
      message.senderUserName === selectedUser
    ) {
      return true;
    }
    return false;
  });

  return (
    <div className=" lg:tw-grid  tw-grid-cols-[400px,auto] tw-h-screen">
      <div className="tw-bg-cardBg lg-tw-h-[100vh] tw-flex tw-flex-col">
        <div>
          <Typography className="tw-px-10 lg:tw-mt-10 xsm:tw-mt-4 tw-text-white tw-text-3xl lg:tw-mb-5">
            Chats
          </Typography>
        </div>
        <div className="lg:tw-h-[100%] lg:tw-flex-1 lg:tw-block xsm:tw-flex tw-overflow-scroll lg:tw-py-10 ">
          {userData.map((user) => (
            <UserCard
              key={user._id}
              name={user.name}
              isTyping={typingUsers.includes(user.name)}
              setUser={setSelectedUser}
            />
          ))}
        </div>
      </div>

      {/* Content for the second column */}
      {selectedUser ? (
        <div className="tw-h-[100vh] tw-bg-darkGreen tw-relative">
          <div className="tw-bg-green tw-py-1 tw-px-10 tw-z-20 tw-border-b-green tw-border-1 tw-border-soli tw-z-30">
            <div className="tw-flex tw-items-baseline">
              <Avatar
                sx={{ bgcolor: green[500], width: '60px', height: '60px' }}
                aria-label="recipe"
                className="tw-uppercase"
              >
                {selectedUser[0]}
              </Avatar>
              <Typography className="tw-pl-5 tw-mt-10 tw-text-white tw-text-2xl tw-mb-5">
                {selectedUser}
              </Typography>
            </div>
          </div>
          <div className="tw-h-[80%] tw-overflow-scroll">
            {filteredArray.map((message) => (
              <ChatCard
                text={message.message}
                key={message.timeStamp + message.message}
                isReply={message.isReply}
                timeStamp={message.timeStamp}
              />
            ))}
          </div>
          <div className="tw-absolute tw-bottom-0 tw-left-0 tw-w-[100%]">
            <Paper
              component="form"
              sx={{
                p: '18px 42px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
              }}
              className="tw-bg-cardBg tw-flex tw-items-center tw-justify-between"
            >
              <InputBase
                sx={{ mx: 'auto', width: '90%' }}
                placeholder="Type a message"
                inputProps={{ 'aria-label': 'Type a message' }}
                className="tw-bg-searchBar tw-px-10 tw-py-3 tw-rounded-xl tw-text-white"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleTyping();
                }}
              />
              <svg
                viewBox="0 0 24 24"
                height="24"
                width="24"
                preserveAspectRatio="xMidYMid meet"
                version="1.1"
                x="0px"
                y="0px"
                className="tw-cursor-pointer hover:tw-opacity-80"
                fill="#fff"
                onClick={sendMessage}
              >
                <title>send</title>
                <path d="M1.101,21.757L23.8,12.028L1.101,2.3l0.011,7.912l13.623,1.816L1.112,13.845 L1.101,21.757z"></path>
              </svg>
            </Paper>
          </div>
        </div>
      ) : (
        <div className="tw-h-[100vh] tw-flex tw-flex-col tw-justify-center tw-items-center tw-bg-darkGreen">
          <img
            src="https://static.whatsapp.net/rsrc.php/v3/yS/r/aGcVD59xVTb.png"
            alt=""
          />
          <Typography className="tw-px-10 tw-text-white tw-text-3xl tw-mb-5 tw-my-10">
            Chit Clans
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Chat;
