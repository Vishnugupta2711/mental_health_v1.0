import React from "react";

const AnimatedLoader = () => {
  return (
    <div className="wrapper flex justify-between relative w-[200px] h-[60px] ml-20 mb-10 bg-gray-900">
      {" "}
     
      <div className="circle bg-blue-500 rounded-full absolute left-[15%] w-[20px] h-[20px] animate-bounce delay-0"></div>
      <div className="circle bg-blue-500 rounded-full absolute left-[45%] w-[20px] h-[20px] animate-bounce delay-200"></div>
      <div className="circle bg-blue-500 rounded-full absolute right-[15%] w-[20px] h-[20px] animate-bounce delay-400"></div>
      
    </div>
  );
};

export default AnimatedLoader;
