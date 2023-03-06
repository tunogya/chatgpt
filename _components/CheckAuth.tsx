import {useRouter} from 'next/router';
import {useCallback, useEffect} from 'react';
import {useSelector} from "react-redux";

const CheckAuth = () => {
  const router = useRouter()
  const accessToken = useSelector((state: any) => state.user.accessToken)

  const check = useCallback(async () => {
    if (accessToken) {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: accessToken
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
  }, [accessToken])

  useEffect(() => {
    check()
  }, [check])

  return (
    <></>
  )
}

export default CheckAuth