import {withPageAuthRequired} from "@auth0/nextjs-auth0";

const Redeem = ({user}: any) => {
  return (
    <div>
      Redeem
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired();

export default Redeem
