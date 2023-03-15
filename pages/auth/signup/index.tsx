import {
  Button, FormControl, FormErrorMessage, FormHelperText, HStack,
  Input, InputGroup, InputRightElement, Spacer,
  Stack, ChakraProvider,
  Text, useColorModeValue
} from '@chakra-ui/react';
import {useMemo, useState} from 'react';
import {useRouter} from 'next/router';
import * as crypto from 'crypto';
import { setUser, setAccessToken } from '@/store/user';
import {useDispatch} from "react-redux";
import {clearSession} from "@/store/session";

const Login = () => {
  const router = useRouter()
  const [show, setShow] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const bg = useColorModeValue('white', 'bg2')
  const fontColor = useColorModeValue('fontColor1', 'fontColor2')
  const dispatch = useDispatch()

  const ref = useMemo(() => {
    if (router.query.ref) {
      const ref = router.query.ref as string
      return ref.replace('-', '#')
    }
    return undefined
  }, [router])

  const isInvalidPassword = useMemo(() => {
    return password.length < 10 && password.length > 0
  }, [password])

  const hashPassword = (password: string) => {
    // add salt and hash 1000 times
    let pwd = password
    for (let i = 0; i < 1000; i++) {
      pwd = crypto.createHash('sha256').update(pwd + process.env.SALT).digest('base64')
    }
    return pwd
  }

  const login = async () => {
    setPending(true)
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password: hashPassword(password),
        ref
      }),
    })
    if (res.status === 200) {
      const {accessToken, user} = await res.json()
      dispatch(setAccessToken(accessToken))
      dispatch(setUser(user))
      dispatch(clearSession());
      await router.push('/chat')
    } else {
      const {error} = await res.json()
      dispatch(clearSession());
      await router.push({
        pathname: '/auth/error',
        query: {
          error
        }
      })
    }
  }

  return (
    <ChakraProvider>
      <Stack h={'full'} w={'full'} bg={bg} justify={'center'} align={'center'} spacing={8} px={2}>
        <HStack w={['full', '300px']}>
          <Button size={'xs'} color={fontColor} onClick={() => {
            router.back()
          }}>返回</Button>
          <Spacer/>
        </HStack>
        <Text textAlign={'center'} fontSize={'sm'} fontWeight={'500'} color={fontColor}>
          欢迎使用ChatGPT
        </Text>
        <Text color={fontColor} fontWeight={'500'} fontSize={'xs'}>{ref ? `Ref: ${ref}` : ''}</Text>
        <Stack w={['full', '300px']} spacing={4}>
          <FormControl>
            <InputGroup variant={'outline'}>
              <Input placeholder={'用户名'} color={fontColor} value={username}
                     onInput={(e) => {
                       // only allow alphanumeric characters, underscore, and dash, no space, no special characters, no emoji
                       // @ts-ignore
                       e.target.value = e.target.value.replace(/[^a-zA-Z0-9-_]/g, '')
                     }}
                     onChange={(e) => setUsername(e.target.value)}/>
            </InputGroup>
          </FormControl>
          <FormControl isInvalid={isInvalidPassword}>
            <InputGroup variant={'outline'}>
              <Input placeholder={'密码'} color={fontColor} type={show ? 'text' : 'password'} value={password}
                     onInput={(e) => {
                       // no space, no chinese characters, no emoji, no full-width symbols
                       // @ts-ignore
                       e.target.value = e.target.value.replace(/[\s\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/g, '')
                     }}
                     onChange={(e) => setPassword(e.target.value)}/>
              <InputRightElement width='4.5rem'>
                <Button h={'1.75rem'} size={'sm'} color={fontColor} onClick={() => setShow(!show)}>
                  {show ? '隐藏' : '展示'}
                </Button>
              </InputRightElement>
            </InputGroup>
            { isInvalidPassword ? (
              <FormErrorMessage fontSize={'xs'}>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                至少10个字符
              </FormErrorMessage>
            ) : (
              <FormHelperText fontSize={'xs'}>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                至少10个字符
              </FormHelperText>
            ) }
          </FormControl>
          <Button w={['full', '300px']} size={'lg'} color={"white"} bg={'#10A37F'} onClick={login} isLoading={pending}>
            注册
          </Button>
        </Stack>
      </Stack>
    </ChakraProvider>
  )
}

export default Login