import {useRouter} from "next/router";

const Login = () => {
  const router = useRouter()

  return (
   <div>
     <button>登陆</button>
     <button>注册</button>
   </div>
  )
}

export default Login