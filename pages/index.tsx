import {useRouter} from 'next/router';
import {useCallback, useEffect} from 'react';
import {useSelector} from "react-redux";

const Index = () => {
  const router = useRouter()
  const jwt = useSelector((state: any) => state.auth.token)

  const checkJWT = useCallback(async () => {
    if (jwt) {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: jwt
        }),
      })
      if (res.status === 200) {
        await router.push('/chat')
      } else {
        await router.push('/auth/login')
      }
    } else {
      await router.push('/auth/login')
    }
  }, [jwt, router])

  useEffect(() => {
    checkJWT()
  }, [checkJWT])

  return (
    <></>
  )
}

export default Index