"use client"

import { useCallback, useRef, useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Plus } from 'lucide-react'
import { cn } from "@/lib/utils"
import { PixelControls } from "./pixel-controls"
// import { Button } from "@/components/ui/button"

export function ImagePixelator() {
  const [image, setImage] = useState<string | null>(null)
  const [pixelSize, setPixelSize] = useState(8)
  const [selectedColor, setSelectedColor] = useState("#ff69b4") // Pink default
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isMousePressed, setIsMousePressed] = useState(false)
  const [canvasSize] = useState(1280) // Fixed canvas size
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)
  const [downloadFileName, setDownloadFileName] = useState("pixelated-image")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type.match(/image\/(jpeg|png|svg\+xml)/)) {
      const img = new Image()
      img.onload = () => {
        setOriginalImage(img)
        setDownloadFileName(file.name.split('.')[0] + "-pixelated")
      }
      img.src = URL.createObjectURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/svg+xml": [],
    },
  })

  const pixelateImage = useCallback(() => {
    if (!originalImage || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set fixed canvas size
    canvas.width = canvasSize
    canvas.height = canvasSize

    // Calculate scaling to fit image in canvas while maintaining aspect ratio
    const scale = Math.min(
      canvasSize / originalImage.width,
      canvasSize / originalImage.height
    )
    const scaledWidth = originalImage.width * scale
    const scaledHeight = originalImage.height * scale
    const offsetX = (canvasSize - scaledWidth) / 2
    const offsetY = (canvasSize - scaledHeight) / 2

    // Clear canvas
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvasSize, canvasSize)

    // Draw original image centered
    ctx.drawImage(
      originalImage,
      offsetX,
      offsetY,
      scaledWidth,
      scaledHeight
    )

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize)
    // const data = imageData.data

    // Create temporary canvas for pixelation
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvasSize
    tempCanvas.height = canvasSize
    const tempCtx = tempCanvas.getContext('2d')
    if (!tempCtx) return

    tempCtx.putImageData(imageData, 0, 0)

    // Clear main canvas
    ctx.fillRect(0, 0, canvasSize, canvasSize)

    // Draw pixelated version
    for (let y = 0; y < canvasSize; y += pixelSize) {
      for (let x = 0; x < canvasSize; x += pixelSize) {
        // Get the color of the first pixel in the block
        const pixelData = tempCtx.getImageData(x, y, 1, 1).data
        ctx.fillStyle = `rgb(${pixelData[0]},${pixelData[1]},${pixelData[2]})`
        ctx.fillRect(x, y, pixelSize, pixelSize)
      }
    }
  }, [originalImage, canvasSize, pixelSize])

  const handleCanvasInteraction = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current) return

      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleY
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Round to nearest pixel block
      const blockX = Math.floor(x / pixelSize) * pixelSize
      const blockY = Math.floor(y / pixelSize) * pixelSize

      // Fill the clicked block with selected color
      ctx.fillStyle = selectedColor
      ctx.fillRect(blockX, blockY, pixelSize, pixelSize)
    },
    [pixelSize, selectedColor]
  )

  useEffect(() => {
    if (originalImage) {
      pixelateImage()
    }
  }, [originalImage, pixelSize, pixelateImage])

  const exportImage = useCallback(() => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = `${downloadFileName}.png`
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }, [downloadFileName])

  const clearCanvas = useCallback(() => {
    if (originalImage) {
      pixelateImage()
    }
  }, [originalImage, pixelateImage])

  const resetToBlankState = useCallback(() => {
    setOriginalImage(null)
    setImage(null)
    setPixelSize(8)
    setSelectedColor("#ff69b4")
    setDownloadFileName("pixelated-image")
  }, [])

  if (!originalImage) {
    return (
      <div
        {...getRootProps()}
        className={cn(
          "w-full max-w-2xl aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors",
          isDragActive ? "border-primary" : "border-muted-foreground"
        )}
      >
        <input {...getInputProps()} />
        <Plus className="w-8 h-8 mb-4" />
        <p className="text-center text-sm tracking-wider">
          DRAG & DROP OR ADD YOUR PICTURE
          <br />
          THAT YOU WANT TO CHANGE
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="relative">
        <canvas
          ref={canvasRef}
          onMouseDown={() => setIsMousePressed(true)}
          onMouseUp={() => setIsMousePressed(false)}
          onMouseLeave={() => setIsMousePressed(false)}
          onMouseMove={(e) => {
            if (isMousePressed) handleCanvasInteraction(e)
          }}
          onClick={handleCanvasInteraction}
          className="w-full rounded-lg cursor-crosshair"
        />
        <PixelControls
          pixelSize={pixelSize}
          onPixelSizeChange={setPixelSize}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
          onExport={exportImage}
          onClear={clearCanvas}
          onReset={resetToBlankState}
          downloadFileName={downloadFileName}
          onDownloadFileNameChange={setDownloadFileName}
        />
      </div>
    </div>
  )
}

