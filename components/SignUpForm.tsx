'use client'

import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("");
  const [passwordOne, setPasswordOne] = useState("");
  
  return (
    <>
      <Heading fontSize={'2xl'}>Sign up</Heading>
      <FormControl id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input type="email" />
      </FormControl>
      <FormControl id="password" mb={5} isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" />
      </FormControl>
      <Stack spacing={6}>
          <Button colorScheme={'blue'} variant={'solid'}>
              Sign Up
          </Button>
      </Stack>
    </>
  )
}