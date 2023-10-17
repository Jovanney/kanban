import React, { FC } from "react";
import { Box } from "@chakra-ui/react";

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
    return (
        <Box>
            {children}
        </Box>
    );
};

export default AuthLayout;