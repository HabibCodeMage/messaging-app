/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState, useEffect } from 'react';
import { Typography, Avatar, InputBase, Paper } from '@mui/material';
import io from 'socket.io-client';
import UserCard from '@/modules/users/components/UserCard';
import { green } from '@mui/material/colors';
import useUserFetch from '@/modules/users/hooks/useUsers';
import { useAuth } from '@/modules/common/contexts/AuthContext';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const { userData, loadingUser } = useUserFetch();
  const { user } = useAuth();
  const socket = io('http://localhost:5000');

  useEffect(() => {
    socket.on('message', (message) => {
      console.log('message', message);
      // setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('typing', (data) => {
      setTypingMessage(`${data.username} is typing...`);
      setTimeout(() => setTypingMessage(''), 3000);
      console.log('message');
    });

    socket.on('connect', () => {
      console.log('Connected to server');
      // Register the user
      socket.emit('register', user?.name);
    });

    socket.on('private_message', ({ message, senderUsername }) => {
      console.log(`Private message ${message}`);

      // Handle the private message
    });

    return () => {
      socket.off('message');
      socket.off('typing');
    };
  }, []);

  const sendMessage = () => {
    const newMessage = { text: message, timestamp: new Date() };
    socket.emit('private_message', {
      recipientUsername: selectedUser,
      message: JSON.stringify({ text: message }),
    });
    setMessage('');
  };

  const handleTyping = () => {
    if (!typing) {
      setTyping(true);
      socket.emit('typing', { username: 'User' });
      setTimeout(() => setTyping(false), 3000);
    }
  };

  return (
    <div className="tw-grid  tw-grid-cols-[400px,auto] tw-h-screen">
      <div className="tw-bg-cardBg tw-h-[100vh] tw-flex tw-flex-col">
        <div>
          <Typography className="tw-px-10 tw-mt-10 tw-text-white tw-text-3xl tw-mb-5">
            Chats
          </Typography>
        </div>
        <div className="tw-h-[100%] tw-flex-1 tw-overflow-scroll py-10 ">
          {userData.map((user) => (
            <UserCard
              key={user._id}
              name={user.name}
              isTyping={false}
              setUser={setSelectedUser}
            />
          ))}
        </div>
      </div>

      {/* Content for the second column */}
      {selectedUser ? (
        <div className="tw-h-[100vh] tw-bg-darkGreen tw-relative">
          <div className="tw-bg-green tw-py-1 tw-px-10 tw-z-20 tw-border-b-green tw-border-1 tw-border-solid">
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
                onChange={(e) => setMessage(e.target.value)}
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
