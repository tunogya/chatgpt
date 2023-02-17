import {
  Button,
  Card,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const PassBody = () => {
  const fontColor = useColorModeValue('fontColor1', 'fontColor2')

  return (
    <Stack spacing={3} minH={'300px'}>
      <Card p={3} variant={'outline'} cursor={'pointer'}>
        <Stack>
          <Text color={fontColor} fontSize={'sm'} fontWeight={'500'}>Free Pass</Text>
          <Text fontSize={'xx-small'} color={fontColor}>
            The Free Pass presents experience benefits for the ChatGPT.
          </Text>
          <br/>
          <HStack spacing={1} align={'baseline'}>
            <Text color={fontColor} fontSize={'xs'} fontWeight={'500'}>
              365 days
            </Text>
            <Text color={fontColor} fontSize={'xs'} fontWeight={'500'}>
              · expired on 3.19
            </Text>
          </HStack>
        </Stack>
      </Card>
      {/*<Card p={3} variant={'outline'} cursor={'pointer'}>*/}
      {/*  <Stack h={'full'}>*/}
      {/*    <HStack>*/}
      {/*      <RiVipCrown2Line color={'gold'}/>*/}
      {/*      <Text color={fontColor} fontSize={'sm'} fontWeight={'500'}>Priority Pass</Text>*/}
      {/*    </HStack>*/}
      {/*    <br/>*/}
      {/*    <HStack spacing={1} align={'baseline'}>*/}
      {/*      <Text color={fontColor} fontSize={'xs'} fontWeight={'500'}>*/}
      {/*        365 days*/}
      {/*      </Text>*/}
      {/*      <Text color={fontColor} fontSize={'xx-small'} fontWeight={'500'}>*/}
      {/*        · expired on 3.19*/}
      {/*      </Text>*/}
      {/*    </HStack>*/}
      {/*  </Stack>*/}
      {/*</Card>*/}
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