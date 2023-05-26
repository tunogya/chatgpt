import {useRouter} from "next/router";
import {useEffect} from "react";

const Login = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/api/auth/login')
  }, [router])

  return <></>
}

export default Login