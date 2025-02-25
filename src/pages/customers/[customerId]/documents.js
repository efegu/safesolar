import { useRouter } from "next/router";

const Documents = () => {
  const { customerId } = useRouter().query;

  return (
    <div>
      <h1>Customer Documents {customerId} </h1>
      {/* Customer details here */}
    </div>
  );
};

export default Documents;