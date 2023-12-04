import Image from "next/image";
export default function Home() {
  return (
    <main className='max-container mx-auto flex max-md:flex-col w-full px-5 py-8 sm:px-16 items-center '>
      <div className='order-1 basis-1/2 flex  flex-col justify-center gap-2 leading-7 max-md:order-2'>
        <h1 className='font-bold text-2xl text-[#013FCB]'>Dashboard</h1>
        <p className='text-gray-7 00 text-xl max-sm:text-sm'>
          This application is used to manage the issues which may occur during
          working on a technical, organizational, etc project. This application
          gives a push to solve your issues by monitoring the tasks and provides
          a sense of transparency.
        </p>
        <span className='font-bold text-xl text-[#00008B] mt-10'>
          Steps to Follow
        </span>
        <ul className='list-disc text-lg  text-[#00008B] font-semibold ml-6'>
          <li>Click on the tickets on the navbar to see all your tickets.</li>
          <li>
            Create new tickets if there are no tickets in the ticket section.
          </li>
          <li>Fill the required information to make a new ticket.</li>
          <li>
            Tickets can be deleted by clicking on the bin icon on the desired
            ticket.
          </li>
        </ul>
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
