import {chakra, Stack, Text} from '@chakra-ui/react';

const Index = () => {
  return (
    <Stack bg={'bg2'} h={'full'} alignItems={"center"} justify={"center"} spacing={4}>
      <chakra.img src={'/openai.svg'} w={'40px'} h={'40px'}/>
      <Text color={'white'} fontSize={'sm'}>请稍候，我们正在检查您的浏览器...</Text>
    </Stack>
  )
}

export default Index