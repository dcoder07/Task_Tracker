import Image from "next/image";
export default function Home() {
  return (
    <main className='max-container mx-auto flex max-md:flex-col w-full px-5 py-8 sm:px-16 items-center '>
      <div className='order-1 basis-1/2 flex  flex-col justify-center gap-2 leading-7 max-md:order-2'>
        <h1 className='font-bold text-2xl text-[#013FCB]'>Dashboard</h1>
        <p className='text-gray-7 00 text-xl max-sm:text-sm'>
          Lorem Ipsum has been the industry standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it
          to make a type specimen book. It has survived not only five centuries,
          but are like Aldus PageMaker including versions of Lorem Ipsum.
        </p>
      </div>
      <div className='basis-1/2 w-full flex justify-center order-2 max-md:order-1'>
        <img
          src='https://cdni.iconscout.com/illustration/premium/thumb/dashboard-analysis-data-5624576-4685125.png?f=webp'
          alt='dash-img'
          className='m-4 max-w-xs sm:max-w-md w-full'
        />
      </div>
    </main>
  );
}
