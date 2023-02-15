import {
  Button, FormControl, FormErrorMessage, FormHelperText, HStack,
  Input, InputGroup, InputRightElement, Spacer,
  Stack,
  Text, useColorModeValue
} from '@chakra-ui/react';
import {useMemo, useState} from 'react';
import {useRouter} from 'next/router';
import {useRecoilState} from 'recoil';
import {jwtAtom} from '@/state';
import * as crypto from 'crypto';

const Login = () => {
  const router = useRouter()
  const [show, setShow] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [, setJWT] = useRecoilState(jwtAtom)
  const bg = useColorModeValue('white', 'bg2')
  const fontColor = useColorModeValue('fontColor1', 'fontColor2')

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
        password: hashPassword(password)
      }),
    })
    if (res.status === 200) {
      const {token} = await res.json()
      setJWT(token)
      await router.push('/chat')
    } else {
      const {error} = await res.json()
      await router.push({
        pathname: '/auth/error',
        query: {
          error
        }
      })
    }
  }

  return (
    <Stack h={'full'} w={'full'} bg={bg} justify={'center'} align={'center'} spacing={8} px={2}>
      <HStack w={['full', '300px']}>
        <Button size={'xs'} onClick={() => {
          router.back()
        }}>Back</Button>
        <Spacer/>
      </HStack>
      <Text textAlign={'center'} fontSize={'sm'} fontWeight={'500'} color={fontColor}>
        Welcome to ChatGPT via WizardingPay
      </Text>
      <Stack w={['full', '300px']} spacing={4}>
        <FormControl>
          <InputGroup variant={'outline'}>
            <Input placeholder={'Username'} color={fontColor} value={username}
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
            <Input placeholder={'Password'} color={fontColor} type={show ? 'text' : 'password'} value={password}
                   onInput={(e) => {
                      // no space, no chinese characters, no emoji, no full-width symbols
                      // @ts-ignore
                      e.target.value = e.target.value.replace(/[\s\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/g, '')
                   }}
                   onChange={(e) => setPassword(e.target.value)}/>
            <InputRightElement width='4.5rem'>
              <Button h={'1.75rem'} size={'sm'} color={fontColor} onClick={() => setShow(!show)}>
                {show ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
          { isInvalidPassword ? (
            <FormErrorMessage fontSize={'xs'}>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              at last 10 characters
            </FormErrorMessage>
          ) : (
            <FormHelperText fontSize={'xs'}>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              at last 10 characters
            </FormHelperText>
          ) }
        </FormControl>
        <Button w={['full', '300px']} size={'lg'} color={"white"} bg={'#10A37F'} onClick={login} isLoading={pending}>
          Sign up
        </Button>
      </Stack>
    </Stack>
  )
}

export default Login