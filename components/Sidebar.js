import { Avatar } from "@chakra-ui/avatar"
import { Button } from "@chakra-ui/button"
import { ArrowLeftIcon} from "@chakra-ui/icons"
import {Flex, Text} from "@chakra-ui/layout"
import {signOut} from "firebase/auth";
import { auth } from "../firebaseconfig";
import { useAuthState } from 'react-firebase-hooks/auth';




export default function SideBar(){
    const [user] = useAuthState(auth);
    
    return (
        <Flex
          //bg="blue.100"
          w="300px" h="380vh"
          borderEnd = "1px solid" borderColor="gray.200"
        >

         <Flex
            //bg="red.100"
            h = "81px" w = "100%"
            align="center" justifyContent = "space-between"
            //borderBottom="1px solid" borderColor="gray.200"
            p={3}
         >

        <Flex align="center">
            <Avatar marginEnd={3} src={user.photoURL}/>
            <Text> {user.displayName} </Text>
        </Flex>
        <Button h="3.2vh" boxShadow ="md" onClick={() =>signOut(auth) } > SignOut </Button>
         </Flex>
        </Flex>
    )
}