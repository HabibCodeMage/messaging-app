import { Typography } from '@mui/material';
import React, { FC } from 'react';

const formatTimestamp = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

const ChatCard: FC<{ text: string; isReply: boolean, timeStamp: string

 }> = ({
  text,
  isReply = true,
  timeStamp,
}) => {
  return (
    <div
      className={`tw-p-4 tw-max-w-60 min-w-[50px] tw-rounded-lg tw-m-3 ${isReply ? 'tw-bg-replyGreen tw-ml-auto' : 'tw-bg-incomingGreen'}`}
    >
      <Typography className="tw-text-white tw-mb-1">{text}</Typography>
      <p className='tw-text-white tw-text-sm tw-m-0'>{formatTimestamp(timeStamp)}</p>
    </div>
  );
};
export default ChatCard;
