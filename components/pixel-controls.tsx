"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Download, Eraser, RotateCcw } from 'lucide-react'
import { Input } from "@/components/ui/input"

interface PixelControlsProps {
  pixelSize: number
  onPixelSizeChange: (size: number) => void
  selectedColor: string
  onColorChange: (color: string) => void
  onExport: () => void
  onClear: () => void
  onReset: () => void
  downloadFileName: string
  onDownloadFileNameChange: (name: string) => void
}

export function PixelControls({
  pixelSize,
  onPixelSizeChange,
  selectedColor,
  onColorChange,
  onExport,
  onClear,
  onReset,
  downloadFileName,
  onDownloadFileNameChange,
}: PixelControlsProps) {
  return (
    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-4 p-4 bg-background/80 backdrop-blur rounded-lg">
      <div className="flex items-center gap-4">
        <Select
          value={pixelSize.toString()}
          onValueChange={(value) => onPixelSizeChange(Number(value))}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Pixel size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4">4px</SelectItem>
            <SelectItem value="8">8px</SelectItem>
            <SelectItem value="16">16px</SelectItem>
            <SelectItem value="32">32px</SelectItem>
            <SelectItem value="64">64px</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-9 h-9 p-1 bg-background border rounded"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={downloadFileName}
          onChange={(e) => onDownloadFileNameChange(e.target.value)}
          className="w-40"
          placeholder="File name"
        />
        <Button variant="outline" size="icon" onClick={onClear}>
          <Eraser className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onExport}>
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

