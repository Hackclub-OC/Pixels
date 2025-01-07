"use client"

import { useState } from "react"
import { ImagePixelator } from "@/components/image-pixelator"

export default function Home() {
  const [isEditorMode, setIsEditorMode] = useState(false)

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-4 font-mono bg-background text-foreground dark:bg-black dark:text-white">
      {!isEditorMode && (
        <div className="w-full text-center mb-8">
          <h1 className="text-xl font-mono tracking-wider inline-block">
            Pixelate an Image
          </h1>
        </div>
      )}
      <ImagePixelator onEditorModeChange={setIsEditorMode} />
      <div className="text-sm tracking-wider mt-8">
        Check the <a className="underline" href="https://github.com/Hackclub-OC/pixels">Source Code</a>
      </div>         
    </main>
  )
}

