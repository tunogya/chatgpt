import NavigationBar from "@/components/NavigationBar/index";

const PCNavigation = () => {
  return (
    <div className={'dark hidden bg-gray-900 md:fixed md:inset-y-0 md:flex md:w-[260px] md:flex-col'}>
      <div className={'flex h-full min-h-0 flex-col '}>
        <NavigationBar/>
      </div>
    </div>
  )
}

export default PCNavigation