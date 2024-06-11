/* eslint-disable @next/next/no-img-element */
'use client';
import api from '@/api';
import { setTokenToLocalStorage } from '@/modules/common/utils';
import { Button, TextField } from '@mui/material';
import { AxiosError } from 'axios';
import Link from 'next/link';
import React, { useReducer, useState } from 'react';
import toast from 'react-hot-toast';
import { FadeLoader } from 'react-spinners';

// Define types for state and action
type State = {
  name: string;
  password: string;
};

type Action =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string };

const initialState: State = {
  name: '',
  password: '',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    default:
      return state;
  }
}

export default function LoginPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch({
      type: name === 'name' ? 'SET_NAME' : 'SET_PASSWORD',
      payload: value,
    });
  };

  const validate = () => {
    if (state.name.trim() === '' || state.password.trim() === '') {
      throw new Error('Name and Password can not be empty');
    }
  };
  const onSubmit = async () => {
    try {
      setLoading(true);
      validate();
      const response = await api.auth.login(state.name, state.password);
      const baseUrl = window.location.origin;
      setTokenToLocalStorage(response.data.token);
      window.location.href = baseUrl;
    } catch (error) {
      const errorMsg =
        error instanceof AxiosError
          ? error?.response?.data.message
          : error instanceof Error
            ? error.message
            : 'Invalid Credentials';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="tw-grid tw-grid-cols-2 tw-max-h-[100vh] tw-h-[100vh]">
      <div className="tw-flex tw-flex-col tw-h-[100%] tw-mx-10 tw-my-10">
        <h1>Welcome Back</h1>
        <h1 className="tw-italic">Lets start by signing in!</h1>
        <p className="tw-no-underline tw-text-lg tw-mb-10">
          Do not have an account{' '}
          <Link href={'/signup'} className="tw-no-underline">
            Sign Up
          </Link>
        </p>
        <p className="tw-font-bold">User Name</p>
        <TextField
          label="User Name"
          variant="outlined"
          className="tw-mb-2"
          name="name"
          onChange={handleChange}
        />
        <p className="tw-font-bold">Password</p>
        <TextField
          label="Password"
          variant="outlined"
          className="tw-mb-6"
          name="password"
          onChange={handleChange}
        />
        <Button
          variant="contained"
          className="tw-bg-green tw-py-2 mb-5 tw-min-h-20"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading && <FadeLoader color="#36d7b7" speedMultiplier={1.5} />}
          Login
        </Button>
      </div>
      <div className=" tw-bg-[#006769] tw-rounded-2xl tw-mx-10 tw-my-10 tw-px-10">
        <div className="tw-flex tw-flex-col tw-h-[100%]">
          <div className="tw-text-white">
            <h1 className="tw-italic">
              The simplest way to connect with your loved
            </h1>
            <h1 className="tw-font-bold tw-text-5xl">Chit Clan</h1>
          </div>
          <div className="tw-flex-1">
            <img
              src={
                'https://images.stockcake.com/public/7/b/f/7bf0969a-a483-41a7-a9eb-0c8e5febabd5_large/interactive-technology-display-stockcake.jpg'
              }
              alt="alt"
              className="tw-w-[100%] tw-rounded-xl tw-flex-1 tw-h-[90%]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
