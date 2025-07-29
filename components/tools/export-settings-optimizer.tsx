"use client"

import { useState } from "react"
import { Copy, Check, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

// Platform options
const platforms = [
  { name: "YouTube", value: "youtube" },
  { name: "Instagram", value: "instagram" },
  { name: "TikTok", value: "tiktok" },
  { name: "Facebook", value: "facebook" },
  { name: "Twitter", value: "twitter" },
  { name: "Vimeo", value: "vimeo" },
  { name: "Broadcast", value: "broadcast" },
  { name: "Cinema", value: "cinema" },
]

// Content type options
const contentTypes = [
  { name: "Live Action", value: "live-action" },
  { name: "Animation", value: "animation" },
  { name: "Screen Recording", value: "screen-recording" },
  { name: "Gaming", value: "gaming" },
  { name: "Mixed Media", value: "mixed-media" },
]

// Quality presets
const qualityPresets = [
  { name: "Draft (Fast Export)", value: "draft" },
  { name: "Standard (Balanced)", value: "standard" },
  { name: "High Quality", value: "high" },
  { name: "Maximum Quality", value: "maximum" },
]

// Export settings recommendations based on platform, content type, and quality
const getRecommendedSettings = (platform: string, contentType: string, quality: string, duration: number) => {
  // Base settings
  const settings = {
    codec: "H.264",
    container: "MP4",
    resolution: "1920×1080",
    aspectRatio: "16:9",
    frameRate: 30,
    videoBitrate: 8,
    audioBitrate: 128,
    audioChannels: "Stereo",
    audioSampleRate: 48,
    estimatedSize: 0,
  }

  // Platform-specific adjustments
  switch (platform) {
    case "youtube":
      settings.resolution = quality === "high" || quality === "maximum" ? "3840×2160" : "1920×1080"
      settings.videoBitrate = quality === "draft" ? 8 : quality === "standard" ? 15 : quality === "high" ? 25 : 45
      settings.frameRate = contentType === "gaming" ? 60 : 30
      break
    case "instagram":
      settings.resolution = "1080×1080"
      settings.aspectRatio = "1:1"
      settings.videoBitrate = quality === "draft" ? 5 : quality === "standard" ? 10 : 15
      break
    case "tiktok":
      settings.resolution = "1080×1920"
      settings.aspectRatio = "9:16"
      settings.videoBitrate = quality === "draft" ? 5 : quality === "standard" ? 10 : 15
      break
    case "facebook":
      settings.videoBitrate = quality === "draft" ? 5 : quality === "standard" ? 10 : 15
      break
    case "twitter":
      settings.videoBitrate = quality === "draft" ? 5 : quality === "standard" ? 8 : 12
      break
    case "vimeo":
      settings.codec = quality === "high" || quality === "maximum" ? "H.265" : "H.264"
      settings.resolution = quality === "high" || quality === "maximum" ? "3840×2160" : "1920×1080"
      settings.videoBitrate = quality === "draft" ? 8 : quality === "standard" ? 15 : quality === "high" ? 25 : 40
      break
    case "broadcast":
      settings.codec = "ProRes 422"
      settings.container = "MOV"
      settings.videoBitrate = 100
      settings.audioBitrate = 320
      settings.audioChannels = "5.1 Surround"
      break
    case "cinema":
      settings.codec = "ProRes 4444"
      settings.container = "MOV"
      settings.resolution = "4096×2160"
      settings.videoBitrate = 150
      settings.audioBitrate = 320
      settings.audioChannels = "5.1 Surround"
      break
  }

  // Content type adjustments
  switch (contentType) {
    case "animation":
      settings.frameRate = 24
      if (quality !== "draft") {
        settings.videoBitrate = Math.max(5, settings.videoBitrate * 0.8) // Animation compresses better
      }
      break
    case "screen-recording":
      settings.frameRate = 30
      settings.videoBitrate = Math.min(50, settings.videoBitrate * 1.2) // Screen recordings need more bitrate
      break
    case "gaming":
      settings.frameRate = 60
      settings.videoBitrate = Math.min(50, settings.videoBitrate * 1.2) // Gaming needs more bitrate
      break
  }

  // Quality adjustments
  if (quality === "draft") {
    settings.frameRate = Math.min(settings.frameRate, 30)
    settings.audioBitrate = 96
  } else if (quality === "maximum") {
    if (settings.codec === "H.264") {
      settings.codec = "H.265"
    }
    settings.audioBitrate = 320
  }

  // Calculate estimated file size in MB
  // Formula: (video bitrate + audio bitrate) * duration in seconds / 8 / 1024
  const videoBitrateKbps = settings.videoBitrate * 1000
  const audioBitrateKbps = settings.audioBitrate
  const totalBitrateKbps = videoBitrateKbps + audioBitrateKbps
  const durationSeconds = duration * 60
  const fileSizeMB = (totalBitrateKbps * durationSeconds) / 8 / 1024
  settings.estimatedSize = Math.round(fileSizeMB)

  return settings
}

export default function ExportSettingsOptimizer() {
  const [platform, setPlatform] = useState<string>("youtube")
  const [contentType, setContentType] = useState<string>("live-action")
  const [quality, setQuality] = useState<string>("standard")
  const [duration, setDuration] = useState<number>(5)
  const [copied, setCopied] = useState<boolean>(false)

  const recommendedSettings = getRecommendedSettings(platform, contentType, quality, duration)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportSettings = () => {
    const settings = {
      platform: platforms.find((p) => p.value === platform)?.name,
      contentType: contentTypes.find((c) => c.value === contentType)?.name,
      quality: qualityPresets.find((q) => q.value === quality)?.name,
      duration: `${duration} minutes`,
      ...recommendedSettings,
    }

    const settingsText = Object.entries(settings)
      .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
      .join("\n")

    const blob = new Blob([settingsText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "export-settings.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Input section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Destination Platform</h3>
                <RadioGroup value={platform} onValueChange={setPlatform}>
                  <div className="grid grid-cols-2 gap-2">
                    {platforms.map((p) => (
                      <div key={p.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={p.value} id={`platform-${p.value}`} />
                        <Label htmlFor={`platform-${p.value}`}>{p.name}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Content Type</h3>
                <RadioGroup value={contentType} onValueChange={setContentType}>
                  <div className="grid grid-cols-2 gap-2">
                    {contentTypes.map((c) => (
                      <div key={c.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={c.value} id={`content-${c.value}`} />
                        <Label htmlFor={`content-${c.value}`}>{c.name}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Quality Preset</h3>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality preset" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityPresets.map((q) => (
                      <SelectItem key={q.value} value={q.value}>
                        {q.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">Video Duration (minutes)</h3>
                  <span>{duration} min</span>
                </div>
                <Slider
                  value={[duration]}
                  min={1}
                  max={120}
                  step={1}
                  onValueChange={(value) => setDuration(value[0])}
                />
              </div>
            </div>

            {/* Results section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Recommended Export Settings</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">Codec</Label>
                      <div className="font-medium">{recommendedSettings.codec}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Container</Label>
                      <div className="font-medium">{recommendedSettings.container}</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">Resolution</Label>
                      <div className="font-medium">{recommendedSettings.resolution}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Aspect Ratio</Label>
                      <div className="font-medium">{recommendedSettings.aspectRatio}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">Frame Rate</Label>
                      <div className="font-medium">{recommendedSettings.frameRate} fps</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Video Bitrate</Label>
                      <div className="font-medium">{recommendedSettings.videoBitrate} Mbps</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">Audio Bitrate</Label>
                      <div className="font-medium">{recommendedSettings.audioBitrate} kbps</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Audio Channels</Label>
                      <div className="font-medium">{recommendedSettings.audioChannels}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">Audio Sample Rate</Label>
                      <div className="font-medium">{recommendedSettings.audioSampleRate} kHz</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-muted-foreground text-xs">Estimated File Size</Label>
                    <div className="font-medium text-lg">{recommendedSettings.estimatedSize} MB</div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(JSON.stringify(recommendedSettings, null, 2))}
                          >
                            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                            Copy Settings
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy settings to clipboard</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Button variant="default" size="sm" onClick={handleExportSettings}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Settings
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform-specific tips */}
      <div className="space-y-4">
        <h3 className="text-xl font-medium">Platform-Specific Tips</h3>

        {platform === "youtube" && (
          <Card>
            <CardHeader>
              <CardTitle>YouTube Export Tips</CardTitle>
              <CardDescription>Optimize your videos for YouTube</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>• YouTube re-encodes all videos, so focus on providing the highest quality source.</p>
              <p>• For HDR content, use H.265 (HEVC) with HDR10 or HLG metadata.</p>
              <p>• YouTube recommends 4K uploads even if your content is 1080p for better quality after transcoding.</p>
              <p>• For gaming content, 60fps is recommended for smoother playback.</p>
            </CardContent>
          </Card>
        )}

        {platform === "instagram" && (
          <Card>
            <CardHeader>
              <CardTitle>Instagram Export Tips</CardTitle>
              <CardDescription>Optimize your videos for Instagram</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>• Instagram Feed videos: 1:1 (square), 4:5 (portrait), or 16:9 (landscape).</p>
              <p>• Instagram Stories/Reels: 9:16 (vertical) with 1080×1920 resolution.</p>
              <p>• Maximum video length: 60 seconds for feed, 15 seconds for stories, 90 seconds for reels.</p>
              <p>• Instagram heavily compresses videos, so avoid dark scenes and fast motion when possible.</p>
            </CardContent>
          </Card>
        )}

        {platform === "tiktok" && (
          <Card>
            <CardHeader>
              <CardTitle>TikTok Export Tips</CardTitle>
              <CardDescription>Optimize your videos for TikTok</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>• TikTok prefers 9:16 vertical videos with 1080×1920 resolution.</p>
              <p>• Maximum video length: 3 minutes (10 minutes for some accounts).</p>
              <p>• TikTok heavily compresses videos, so use bright, high-contrast visuals.</p>
              <p>• Audio is important - ensure clear audio with good levels.</p>
            </CardContent>
          </Card>
        )}

        {(platform === "broadcast" || platform === "cinema") && (
          <Card>
            <CardHeader>
              <CardTitle>Professional Delivery Tips</CardTitle>
              <CardDescription>Optimize your videos for professional delivery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>• Always confirm delivery specifications with your client or distributor.</p>
              <p>• ProRes 422 is standard for broadcast, while ProRes 4444 preserves alpha channels.</p>
              <p>• Include 2-pop and color bars when delivering to broadcasters.</p>
              <p>• Check audio levels to ensure they meet broadcast standards (-24 LUFS for most broadcast).</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

