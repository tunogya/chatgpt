import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {useSelector} from "react-redux";

const Index = () => {
  const router = useRouter()
  const jwt = useSelector((state: any) => state.user.token)

  const checkJWT = async () => {
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
        await router.push({
          pathname: '/chat',
          query: {...router.query}
        })
      } else {
        await router.push({
          pathname: '/auth/login',
          query: {...router.query}
        })
      }
    } else {
      await router.push({
        pathname: '/auth/login',
        query: {...router.query}
      })
    }
  }

  useEffect(() => {
    checkJWT()
  })

  return (
    <></>
  )
}

export default Index