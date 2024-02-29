import Image from "next/image";

export default async function Home() {

  const HandleFetching = async()=>{
    const res = await fetch(`http://localhost:3000/Scrapp`,{
      headers:{"Content-Type": "application/json"}
    })
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     Home
     <form action={HandleFetching}>
          <button>Execute</button>
     </form>
    </main>
  );
}
