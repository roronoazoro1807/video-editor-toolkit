"use client"

import { useEffect, useRef, useState } from "react"
import { Upload, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AspectRatioVisualizerProps {
  originalWidth: number
  originalHeight: number
  newWidth: number
  newHeight: number
  method: "crop" | "pad"
  onImageLoad?: (width: number, height: number) => void
}

export function AspectRatioVisualizer({
  originalWidth,
  originalHeight,
  newWidth,
  newHeight,
  method,
  onImageLoad,
}: AspectRatioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [hasImage, setHasImage] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        setImage(img)
        setHasImage(true)
        // Notify parent component about the image dimensions
        if (onImageLoad) {
          onImageLoad(img.naturalWidth, img.naturalHeight)
        }
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        setImage(img)
        setHasImage(true)
        // Notify parent component about the image dimensions
        if (onImageLoad) {
          onImageLoad(img.naturalWidth, img.naturalHeight)
        }
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  // Reset image
  const resetImage = () => {
    setImage(null)
    setHasImage(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !originalWidth || !originalHeight || !newWidth || !newHeight) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas size
    const maxDimension = 300
    const scale = Math.min(maxDimension / Math.max(originalWidth, originalHeight, newWidth, newHeight), 1)

    canvas.width = Math.max(originalWidth, newWidth) * scale + 40
    canvas.height = Math.max(originalHeight, newHeight) * scale + 40

    // Center point
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Draw original frame
    const originalScaledWidth = originalWidth * scale
    const originalScaledHeight = originalHeight * scale
    const originalX = centerX - originalScaledWidth / 2
    const originalY = centerY - originalScaledHeight / 2

    if (hasImage && image) {
      // Draw the image instead of a colored rectangle
      ctx.drawImage(
        image, 
        originalX, 
        originalY, 
        originalScaledWidth, 
        originalScaledHeight
      )
    } else {
      // Draw a colored rectangle if no image
      ctx.fillStyle = "#1e293b" // Slate 800
      ctx.fillRect(originalX, originalY, originalScaledWidth, originalScaledHeight)
    }

    // Draw new frame
    const newScaledWidth = newWidth * scale
    const newScaledHeight = newHeight * scale
    const newX = centerX - newScaledWidth / 2
    const newY = centerY - newScaledHeight / 2

    ctx.strokeStyle = "#3b82f6" // Blue 500
    ctx.lineWidth = 2
    ctx.setLineDash([])
    ctx.strokeRect(newX, newY, newScaledWidth, newScaledHeight)

    // Draw crop/pad area
    if (method === "crop") {
      // Create clipping region for the new frame
      ctx.save()
      ctx.beginPath()
      ctx.rect(newX, newY, newScaledWidth, newScaledHeight)
      ctx.clip()
      
      // Draw semi-transparent overlay for the visible area
      ctx.fillStyle = "rgba(59, 130, 246, 0.2)" // Blue 500 with opacity
      ctx.fillRect(newX, newY, newScaledWidth, newScaledHeight)
      
      ctx.restore()

      // Draw the area that will be cropped with diagonal lines
      ctx.beginPath()
      ctx.setLineDash([5, 5])
      ctx.lineWidth = 1
      ctx.strokeStyle = "#ef4444" // Red 500

      // Left crop area if needed
      if (newX > originalX) {
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)" // Red 500 with opacity
        ctx.fillRect(originalX, originalY, newX - originalX, originalScaledHeight)
        ctx.strokeRect(originalX, originalY, newX - originalX, originalScaledHeight)
      }

      // Right crop area if needed
      if (newX + newScaledWidth < originalX + originalScaledWidth) {
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)" // Red 500 with opacity
        ctx.fillRect(
          newX + newScaledWidth,
          originalY,
          originalX + originalScaledWidth - (newX + newScaledWidth),
          originalScaledHeight,
        )
        ctx.strokeRect(
          newX + newScaledWidth,
          originalY,
          originalX + originalScaledWidth - (newX + newScaledWidth),
          originalScaledHeight,
        )
      }

      // Top crop area if needed
      if (newY > originalY) {
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)" // Red 500 with opacity
        ctx.fillRect(originalX, originalY, originalScaledWidth, newY - originalY)
        ctx.strokeRect(originalX, originalY, originalScaledWidth, newY - originalY)
      }

      // Bottom crop area if needed
      if (newY + newScaledHeight < originalY + originalScaledHeight) {
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)" // Red 500 with opacity
        ctx.fillRect(
          originalX,
          newY + newScaledHeight,
          originalScaledWidth,
          originalY + originalScaledHeight - (newY + newScaledHeight),
        )
        ctx.strokeRect(
          originalX,
          newY + newScaledHeight,
          originalScaledWidth,
          originalY + originalScaledHeight - (newY + newScaledHeight),
        )
      }
    } else {
      // Pad method - draw the original content centered in the new frame
      // Fill the new frame with a background color
      ctx.fillStyle = "#0f172a" // Slate 900
      ctx.fillRect(newX, newY, newScaledWidth, newScaledHeight)
      
      // Calculate the position of the original content within the new frame
      const paddedOriginalX = centerX - originalScaledWidth / 2
      const paddedOriginalY = centerY - originalScaledHeight / 2
      
      if (hasImage && image) {
        // Draw the image centered in the new frame
        ctx.drawImage(
          image, 
          paddedOriginalX, 
          paddedOriginalY, 
          originalScaledWidth, 
          originalScaledHeight
        )
      } else {
        // Draw a colored rectangle if no image
        ctx.fillStyle = "#1e293b" // Slate 800
        ctx.fillRect(paddedOriginalX, paddedOriginalY, originalScaledWidth, originalScaledHeight)
      }

      // Draw the original frame inside the new frame
      ctx.strokeStyle = "#10b981" // Emerald 500
      ctx.lineWidth = 2
      ctx.setLineDash([])
      ctx.strokeRect(paddedOriginalX, paddedOriginalY, originalScaledWidth, originalScaledHeight)

      // Add label for padding areas
      ctx.fillStyle = "#94a3b8" // Slate 400
      ctx.font = "12px sans-serif"

      // Label horizontal padding if needed
      if (newScaledWidth > originalScaledWidth) {
        ctx.fillText("Padding", centerX - 25, paddedOriginalY - 5)
      }

      // Label vertical padding if needed
      if (newScaledHeight > originalScaledHeight) {
        ctx.fillText("Padding", paddedOriginalX - 50, centerY)
      }
    }

    // Add labels
    ctx.fillStyle = "#ffffff"
    ctx.font = "12px sans-serif"
    ctx.fillText(`Original: ${originalWidth}×${originalHeight}`, 10, 15)
    ctx.fillText(`New: ${newWidth}×${newHeight}`, 10, 35)
  }, [originalWidth, originalHeight, newWidth, newHeight, method, image, hasImage])

  return (
    <div className="space-y-4">
      <div 
        className={`border rounded-md p-4 bg-muted/30 ${isDragging ? 'border-primary' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <canvas ref={canvasRef} className="mx-auto" />
      </div>
      
      <div className="flex justify-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={triggerFileInput}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {hasImage ? "Change Image" : "Upload Image"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload an image to see how it will look with the new aspect ratio</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {hasImage && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetImage}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove the uploaded image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
      
      <div className="text-sm text-muted-foreground text-center">
        {!hasImage && "Upload an image or drag and drop to see how your content will look"}
        {hasImage && method === "crop" && `Image dimensions: ${image?.naturalWidth || 0}×${image?.naturalHeight || 0} - Areas highlighted in red will be cropped out`}
        {hasImage && method === "pad" && `Image dimensions: ${image?.naturalWidth || 0}×${image?.naturalHeight || 0} - Gray areas show padding that will be added`}
      </div>
    </div>
  )
}

