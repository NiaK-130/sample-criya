import Head from "next/head";
import { Search2Icon } from "@chakra-ui/icons";
import { Box, Button, Center, Stack, Heading} from "@chakra-ui/react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import {auth} from "../firebaseconfig";


export default function Login(){
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

    return (
    <>
    

        <Head>
            <title>Login</title>
        </Head>

        
        
        <Center h = "100vh">
            <Stack 
              align="center"
              bgColor="gray.300"
              p={16}
              rounded="xl"
              spacing={12}
              boxShadow="lg"
            >
                <Box 
                    bgColor = "blue.400"
                    w = "fit-content"
                    p={5}
                    rounded="xl"
                    boxShadow="md"
                >
                  <Search2Icon w = "100px" h = "100px" color = "white"/>
                </Box>
            
                <Heading size="md">Welcome to McWay Designs</Heading>
              <Button boxShadow ="md" onClick={() => signInWithGoogle("", {prompt:"select_account"})} > Sign In with Google </Button>
            </Stack>
        </Center>
    </>

    )

}