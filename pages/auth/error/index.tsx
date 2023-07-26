import {useRouter} from "next/router";
import AbandonIcon from "@/components/SVG/AbandonIcon";

const Error = () => {
  const router = useRouter();
  const message = router.query?.error as string || '';

  return (
    <div className="w-full h-full flex justify-center items-center flex-col bg-gray-50 dark:bg-gray-800">
      <div className="w-96 flex flex-col justify-center items-center">
        <div className="mb-5">
          <AbandonIcon width={'140'}/>
        </div>
        <div className="mb-2 text-center text-lg">Oops!</div>
        <div className="mb-5 text-center">{message}</div>
        <button className="btn relative btn-neutral" onClick={() => {
          router.back()
        }}>
          <div className="flex w-full items-center justify-center gap-2">Back</div>
        </button>
      </div>
    </div>
  )
}

export default Error