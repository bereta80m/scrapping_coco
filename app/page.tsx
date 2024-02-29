import Image from "next/image";

export default async function Home() {

  const HandleFetching = async()=>{

  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     Home
     <form action={async()=>{
      "use server"
      await fetch(`https://scrapping-coco.vercel.app/Scrapp`)
     }}>
          <button>Execute</button>
     </form>
    </main>
  );
}
