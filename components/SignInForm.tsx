'use client';

import { onAuthStateChange, signIn } from '@/utils/firebase/authService';
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';

export default function SignInForm() {
  const [user, setUser] = useState<User | null>();
  const [alert, setAlert] = useState<{status: string, title: string, description: string} | null>(null);
  const router = useRouter();
  
  const handlerLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

    signIn(email, password)
    .then((user) => {
      setAlert({
        status: 'success',
        title: `Welcome ${user.user.email}`,
        description: 'Sign in successful!'
      });
    })
    .catch((error) => {
      setAlert({
        status: 'error',
        title: 'Incorrect email or password. Please try again.',
        description: ''
      });
    });
  }

  useEffect(() => {
    const unsubscribe = () => {
       return onAuthStateChange((user) => {
        if(user) {
          setUser(user)
        }
        else{
          setUser(user)
        }
       });
    }
    return unsubscribe();
  }, []);

  if (user) {
    router.push('/kanban');
  };

  return (
    <>
      {alert && (
      <Alert w="100%" status={alert.status}>
        <AlertIcon />
        <AlertTitle>{alert.title}</AlertTitle>
        <AlertDescription>{alert.description}</AlertDescription>
      </Alert>
      )}
      <form onSubmit={handlerLogin}>
        <Heading fontSize={'2xl'}>Sign in to your account</Heading>
        <FormControl id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input type="email" />
        </FormControl>
        <FormControl id="password" mb={5} isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" />
        </FormControl>
        <Stack spacing={6}>
          <Button type="submit" colorScheme={'blue'} variant={'solid'}>
            Sign in
          </Button>
        </Stack>
      </form>
    </>
  )
}