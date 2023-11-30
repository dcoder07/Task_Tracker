import React from "react";
import LoadingIcons from "react-loading-icons";
export default function loading() {
  return (
    <div className='text-3xl font-semibold flex gap-2 text-center text-[#013FCB] items-center justify-center h-[50vh]'>
    Loading<LoadingIcons.Oval stroke='#013FCB' className="loader mt-2"/>
    </div>
  );
}
