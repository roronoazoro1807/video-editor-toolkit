"use client"

import { useState, useEffect } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AspectRatioVisualizer } from "@/components/tools/aspect-ratio-visualizer"
import { toast } from "sonner"

// Common aspect ratios
const aspectRatios = [
  { name: "16:9 (Widescreen)", value: "16:9" },
  { name: "1:1 (Square)", value: "1:1" },
  { name: "9:16 (Vertical)", value: "9:16" },
  { name: "4:3 (Standard)", value: "4:3" },
  { name: "2.35:1 (Cinemascope)", value: "2.35:1" },
  { name: "21:9 (Ultrawide)", value: "21:9" },
  { name: "3:2 (Photo)", value: "3:2" },
  { name: "Custom", value: "custom" },
]

// Common export resolutions
const commonResolutions = [
  { name: "4K UHD (3840×2160)", width: 3840, height: 2160 },
  { name: "1080p (1920×1080)", width: 1920, height: 1080 },
  { name: "720p (1280×720)", width: 1280, height: 720 },
  { name: "Instagram (1080×1080)", width: 1080, height: 1080 },
  { name: "TikTok/Reels (1080×1920)", width: 1080, height: 1920 },
  { name: "YouTube Shorts (1080×1920)", width: 1080, height: 1920 },
]

export default function AspectRatioCalculator() {
  const [originalWidth, setOriginalWidth] = useState<number>(1920)
  const [originalHeight, setOriginalHeight] = useState<number>(1080)
  const [selectedRatio, setSelectedRatio] = useState<string>("16:9")
  const [customRatioWidth, setCustomRatioWidth] = useState<number>(16)
  const [customRatioHeight, setCustomRatioHeight] = useState<number>(9)
  const [newWidth, setNewWidth] = useState<number>(0)
  const [newHeight, setNewHeight] = useState<number>(0)
  const [method, setMethod] = useState<"crop" | "pad">("crop")
  const [copied, setCopied] = useState<boolean>(false)

  // Calculate new dimensions when inputs change
  useEffect(() => {
    if (!originalWidth || !originalHeight) return

    let ratioWidth: number
    let ratioHeight: number

    if (selectedRatio === "custom") {
      ratioWidth = customRatioWidth
      ratioHeight = customRatioHeight
    } else {
      const [w, h] = selectedRatio.split(":").map(Number)
      ratioWidth = w
      ratioHeight = h
    }

    const targetRatio = ratioWidth / ratioHeight
    const originalRatio = originalWidth / originalHeight

    if (method === "crop") {
      // Maintain original pixel area as much as possible
      if (targetRatio > originalRatio) {
        // Crop height
        const newH = originalWidth / targetRatio
        setNewWidth(originalWidth)
        setNewHeight(Math.round(newH))
      } else {
        // Crop width
        const newW = originalHeight * targetRatio
        setNewWidth(Math.round(newW))
        setNewHeight(originalHeight)
      }
    } else {
      // Padding - maintain all original pixels
      if (targetRatio > originalRatio) {
        // Pad width
        const newW = originalHeight * targetRatio
        setNewWidth(Math.round(newW))
        setNewHeight(originalHeight)
      } else {
        // Pad height
        const newH = originalWidth / targetRatio
        setNewWidth(originalWidth)
        setNewHeight(Math.round(newH))
      }
    }
  }, [originalWidth, originalHeight, selectedRatio, customRatioWidth, customRatioHeight, method])

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Input section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Original Dimensions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="original-width">Width (px)</Label>
                    <Input
                      id="original-width"
                      type="number"
                      min="1"
                      value={originalWidth}
                      onChange={(e) => setOriginalWidth(Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="original-height">Height (px)</Label>
                    <Input
                      id="original-height"
                      type="number"
                      min="1"
                      value={originalHeight}
                      onChange={(e) => setOriginalHeight(Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Target Aspect Ratio</h3>
                <RadioGroup value={selectedRatio} onValueChange={setSelectedRatio}>
                  <div className="grid grid-cols-2 gap-2">
                    {aspectRatios.map((ratio) => (
                      <div key={ratio.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={ratio.value} id={`ratio-${ratio.value}`} />
                        <Label htmlFor={`ratio-${ratio.value}`}>{ratio.name}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                {selectedRatio === "custom" && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="custom-ratio-width">Width</Label>
                      <Input
                        id="custom-ratio-width"
                        type="number"
                        min="1"
                        value={customRatioWidth}
                        onChange={(e) => setCustomRatioWidth(Number.parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custom-ratio-height">Height</Label>
                      <Input
                        id="custom-ratio-height"
                        type="number"
                        min="1"
                        value={customRatioHeight}
                        onChange={(e) => setCustomRatioHeight(Number.parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Conversion Method</h3>
                <Tabs value={method} onValueChange={(value) => setMethod(value as "crop" | "pad")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="crop">Crop</TabsTrigger>
                    <TabsTrigger value="pad">Pad</TabsTrigger>
                  </TabsList>
                  <TabsContent value="crop" className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      Crop method maintains as many original pixels as possible, but may remove some content from the
                      edges.
                    </p>
                  </TabsContent>
                  <TabsContent value="pad" className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      Pad method keeps all original content but adds letterboxing/pillarboxing to fill the new aspect
                      ratio.
                    </p>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Results and visualization */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Result</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>New Width</Label>
                    <div className="flex">
                      <Input value={newWidth} readOnly />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2"
                              onClick={() => handleCopy(newWidth.toString())}
                            >
                              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy to clipboard</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>New Height</Label>
                    <div className="flex">
                      <Input value={newHeight} readOnly />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2"
                              onClick={() => handleCopy(newHeight.toString())}
                            >
                              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy to clipboard</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm">
                    <span className="font-medium">Original Aspect Ratio:</span>{" "}
                    {originalWidth && originalHeight ? `${(originalWidth / originalHeight).toFixed(2)}:1` : "N/A"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">New Aspect Ratio:</span>{" "}
                    {newWidth && newHeight ? `${(newWidth / newHeight).toFixed(2)}:1` : "N/A"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Pixel Change:</span>{" "}
                    {originalWidth && originalHeight && newWidth && newHeight
                      ? `${Math.round(
                          ((newWidth * newHeight - originalWidth * originalHeight) / (originalWidth * originalHeight)) *
                            100,
                        )}%`
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Visualization</h3>
                <AspectRatioVisualizer
                  originalWidth={originalWidth}
                  originalHeight={originalHeight}
                  newWidth={newWidth}
                  newHeight={newHeight}
                  method={method}
                  onImageLoad={(width, height) => {
                    setOriginalWidth(width);
                    setOriginalHeight(height);
                    toast.success(`Image dimensions detected: ${width}×${height}`, {
                      description: "Original dimensions have been updated automatically."
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common export resolutions */}
      <div className="space-y-4">
        <h3 className="text-xl font-medium">Common Export Resolutions</h3>
        <p className="text-muted-foreground">Standard resolutions for different platforms and formats</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {commonResolutions.map((resolution) => (
            <Card key={resolution.name} className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardContent
                className="p-4"
                onClick={() => {
                  setOriginalWidth(resolution.width)
                  setOriginalHeight(resolution.height)
                }}
              >
                <div className="font-medium">{resolution.name}</div>
                <div className="text-sm text-muted-foreground">
                  Aspect Ratio: {(resolution.width / resolution.height).toFixed(2)}:1
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

