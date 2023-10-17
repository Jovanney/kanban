'use client';
import React, { FC } from "react";
import { Box } from "@chakra-ui/react";

import {
  Button,
  Checkbox,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
} from '@chakra-ui/react'
interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
    return (
        <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
            <Flex p={8} flex={1} align={'center'} justify={'center'}>
                <Stack spacing={4} w={'full'} maxW={'md'}>
                    {children}
                </Stack>
            </Flex>
            <Flex flex={1}>
                <Image
                alt={'Login Image'}
                objectFit={'cover'}
                src={
                    'imgloginkanban.jpg'
                }
                />
            </Flex>
        </Stack>
    );
};
export default AuthLayout;