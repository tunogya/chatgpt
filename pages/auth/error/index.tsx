import {Button, Stack, Text, useColorModeValue} from '@chakra-ui/react';
import {useRouter} from 'next/router';

const Error = () => {
  const router = useRouter()
  const {error} = router.query
  const bg = useColorModeValue('white', 'bg2')
  const fontColor = useColorModeValue('fontColor1', 'fontColor2')

  return (
    <Stack h={'full'} w={'full'} bg={bg} align={'center'} justify={'center'}>
      <Text fontSize={'sm'} color={fontColor}>错误</Text>
      <Text fontSize={'sm'} color={fontColor}>啊呀！{error}</Text>
      <Button color={fontColor} onClick={() => router.back()}>返回</Button>
    </Stack>
  )
}

export default Error