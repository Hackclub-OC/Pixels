"use client"

import { useState } from "react"
import { ImagePixelator } from "@/components/image-pixelator"

export default function Home() {
  const [isEditorMode, setIsEditorMode] = useState(false)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 font-mono bg-background text-foreground dark:bg-black dark:text-white">
      {!isEditorMode && (
        <h1 className="text-xl font-mono tracking-wider mb-4">
          Pixelate an Image
        </h1>
      )}
      <ImagePixelator onEditorModeChange={setIsEditorMode} />
      {!isEditorMode && (
        <div className="text-sm tracking-wider mt-4">
          Check the <a className="underline" href="https://github.com/Hackclub-OC/pixels">Source Code</a>
        </div>
      )}
    </main>
  )
}

