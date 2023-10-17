'use client'

import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  
} from '@chakra-ui/react'

export default function SignInForm() {
  return (
        <>
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
              <Button colorScheme={'blue'} variant={'solid'}>
                  Sign in
              </Button>
          </Stack>
        </>
  )
}