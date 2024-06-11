import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { green } from '@mui/material/colors';

const RecipeReviewCard: React.FC<{
  name: string;
  isTyping: false;
  setUser: React.Dispatch<React.SetStateAction<string>>;
}> = ({ name, isTyping, setUser }) => {
  return (
    <Card
      sx={{
        minWidth: '100%',
        maxWidth: '100%',
        height: '100px',
        margin: '10px auto 10px auto',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        '&:hover': {
          opacity: '80%',
        },
      }}
      onClick={() => setUser(name)}
    >
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: green[500] }}
            aria-label="recipe"
            className="tw-uppercase"
          >
            {name[0]}
          </Avatar>
        }
        title={name}
        className="tw-text-white"
      />
      <div className="tw-flex tw-items-center tw-mb-2 tw-ml-10 ">
        {isTyping && (
          <Typography
            variant="body2"
            color="text.secondary"
            className="tw-text-green"
          >
            Typing...
          </Typography>
        )}
      </div>
    </Card>
  );
};

export default RecipeReviewCard;
