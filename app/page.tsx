import Image from "next/image";

export default async function Home() {
  const res = await fetch(`http://localhost:3000/Scrapp`,{
    headers:{"Content-Type": "application/json"}
  })
  const result = await res.json()
  console.log(result)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     Home
    </main>
  );
}
