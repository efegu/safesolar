const InnerSideBar = () => {
    return (
      <div className="w-40 h-screen bg-white text-black p-5 fixed">
        <ul className="text-sm">
          <li className="mb-3"><a href="#">Create Product</a></li>
          <li className="mb-3"><a href="#">Inspections</a></li>
          <li className="mb-3"><a href="#">Customers</a></li>
          <li className="mb-3"><a href="#">Products</a></li>
        </ul>
      </div>
    );
  };
  
  export default InnerSideBar;