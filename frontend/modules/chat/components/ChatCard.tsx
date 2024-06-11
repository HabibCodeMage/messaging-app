import { Typography } from '@mui/material';
import React, { FC } from 'react';

const ChatCard: FC<{ text: string; isReply: boolean }> = ({
  text,
  isReply = true,
}) => {
  return (
    <div
      className={`tw-p-4 tw-max-w-60 min-w-[50px] tw-rounded-lg tw-m-3 ${isReply ? 'tw-bg-replyGreen tw-ml-auto' : 'tw-bg-incomingGreen'}`}
    >
      <Typography className="tw-text-white">{text}</Typography>
    </div>
  );
};
export default ChatCard;
