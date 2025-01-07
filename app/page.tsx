import { ImagePixelator } from "@/components/image-pixelator"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-4 font-mono">
      <div className="w-4 h-4 rounded-full bg-current" />
      <h1 className="text-xl font-mono tracking-wider">Pixelate an Image</h1>
      <ImagePixelator />
      <div className="text-sm tracking-wider">Check the <a className="underline" href="https://github.com/Hackclub-OC/pixels">Source Code</a></div>         
    </main>
  )
}

