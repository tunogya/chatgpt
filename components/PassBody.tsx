import {
  Button,
  Card,
  HStack,
  Spacer,
  Stack,
  Text, useClipboard,
  useColorModeValue,
} from "@chakra-ui/react";
import {RiVipCrown2Line} from "react-icons/ri";
import {useSelector} from "react-redux";
import {useEffect} from "react";

const PassBody = () => {
  const fontColor = useColorModeValue('fontColor1', 'fontColor2');
  const priorityPass = useSelector((state: any) => state.user.priority_pass);
  const priorityPassDays = Math.ceil((priorityPass - Date.now() / 1000) / 86400);
  const expireDate = new Date(priorityPass  * 1000 - 1).toLocaleString().slice(0, 10);
  const user = useSelector((state: any) => state.user.user);
  const { setValue, hasCopied, onCopy } = useClipboard('');

  useEffect(() => {
    if (user) {
      // replace # with - to avoid hashtag in url
      const userWithoutHash = user.replace('#', '-')
      setValue(`https://chat.wizardingpay.com/auth/signup?ref=${userWithoutHash}`)
    }
  }, [user])

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
                <Text color={fontColor} fontSize={'xs'} fontWeight={'500'}>
                  · expired on {expireDate}
                </Text>
              )
            }
          </HStack>
        </Stack>
      </Card>
      <Spacer/>
      <Button borderRadius={'full'} color={fontColor} onClick={onCopy} fontWeight={'semibold'}>
        { hasCopied ? 'Copied!' : 'Copy referral link' }
      </Button>
      <Spacer/>
      <Text fontSize={'xs'} fontWeight={'semibold'} color={fontColor}>
        Share your referral link—when someone signs up, you both get 3 days FREE!
      </Text>
    </Stack>
  )
}

export default PassBody