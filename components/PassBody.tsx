import {
  Button,
  Card,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {RiVipCrown2Line} from "react-icons/ri";
import {useSelector} from "react-redux";

const PassBody = () => {
  const fontColor = useColorModeValue('fontColor1', 'fontColor2');
  const priorityPass = useSelector((state: any) => state.user.priority_pass);

  const priorityPassDays = Math.ceil(priorityPass / 86400);

  const expireDate = new Date(priorityPass * 1000).toLocaleString();

  return (
    <Stack spacing={3} minH={'300px'}>
      <Card p={3} variant={'outline'} cursor={'pointer'}>
        <Stack h={'full'}>
          <HStack>
            <RiVipCrown2Line color={'gold'}/>
            <Text color={fontColor} fontSize={'sm'} fontWeight={'500'}>Priority Pass</Text>
          </HStack>
          <br/>
          <HStack spacing={1} align={'baseline'}>
            <Text color={fontColor} fontSize={'xs'} fontWeight={'500'}>
              {priorityPassDays.toLocaleString()} days
            </Text>
            {
              priorityPassDays > 1 && (
                <Text color={fontColor} fontSize={'xx-small'} fontWeight={'500'}>
                  · expired on {expireDate}
                </Text>
              )
            }
          </HStack>
        </Stack>
      </Card>
      <br/>
      <Text fontSize={'sm'} fontWeight={'500'} color={fontColor}>Join Priority Pass</Text>
      <SimpleGrid columns={[2, null, 3]} spacing={3}>
        {['Annual', 'Quarter', 'Monthly'].map((item) => (
          <Button key={item} w={['full', 'full', '120px']} variant={'outline'} _hover={{boxShadow: 'md'}}>
            <HStack w={'full'} justify={"space-between"}>
              <Text textAlign={'start'} fontSize={'xs'} color={fontColor}
                    fontWeight={'500'}>{item}</Text>
              <Text textAlign={'start'} fontSize={'sm'} color={fontColor}>200</Text>
            </HStack>
          </Button>
        ))}
      </SimpleGrid>
    </Stack>
  )
}

export default PassBody