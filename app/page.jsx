import Image from "next/image";
import dashimg from "./components/dashimg.gif";
export default function Home() {
  return (
    <main className='max-container mx-auto absolute flex max-xl:flex-col w-full px-5 py-8 sm:px-16'>
      <div className='flex justify-center items-center relative bottom-16 '>
        <Image src={dashimg} alt='dash-image' />
      </div>

      <div className=' basis-1/2 flex flex-col gap-5 leading-7 relative bottom-24 xl:top-16'>
        <h1 className='font-bold text-2xl text-[#013FCB] '>Dashboard</h1>
        <p className='text-gray-700 text-xl max-sm:text-sm'>
          Lorem Ipsum has been the industry standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it
          to make a type specimen book. It has survived not only five centuries,
          but also the leap into electronic typesetting, remaining essentially
          unchanged. It was popularised in the 1960s with the release of
          Letraset sheets containing Lorem Ipsum passages, and more recently
          with desktop publishing software like Aldus PageMaker including
          versions of Lorem Ipsum.
        </p>
      </div>
    </main>
  );
}
