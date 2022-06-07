import '../styles/globals.css';
import Login from '../components/Login';
import SideBar from '../components/Sidebar';
import { ChakraProvider, Spinner, Center } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth} from "../firebaseconfig"

function MyApp({ Component, pageProps }) {
  const [user, loading, error] = useAuthState(auth);



    if (loading) {
      return (
        <ChakraProvider>
          <Center h="100vh">
            <Spinner size="xl"/>
          </Center>
      </ChakraProvider>
      )
    }

    //if user is not signed in
    if (!user){
      return(
        <ChakraProvider>
          <Login/>
        </ChakraProvider>
        
      )
    }

  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp