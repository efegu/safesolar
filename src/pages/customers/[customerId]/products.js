import { useRouter } from "next/router";

const Products = () => {
  const { customerId } = useRouter().query;

  return (
    <div>
      <h1>Customer Products {customerId} </h1>
      {/* Customer details here */}
    </div>
  );
};

export default Products;