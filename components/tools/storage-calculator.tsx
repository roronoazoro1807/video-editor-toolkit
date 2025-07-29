"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer } from "@/components/ui/chart"

// Codec data with bitrates in Mbps
const codecData = [
  {
    name: "ProRes 422 HQ",
    value: "prores-422-hq",
    bitrates: {
      "1920x1080": 220,
      "3840x2160": 880,
      "4096x2160": 940,
      "5120x2880": 1500,
      "7680x4320": 3500,
    },
  },
  {
    name: "ProRes 422",
    value: "prores-422",
    bitrates: {
      "1920x1080": 147,
      "3840x2160": 588,
      "4096x2160": 627,
      "5120x2880": 1000,
      "7680x4320": 2350,
    },
  },
  {
    name: "ProRes 422 LT",
    value: "prores-422-lt",
    bitrates: {
      "1920x1080": 102,
      "3840x2160": 408,
      "4096x2160": 435,
      "5120x2880": 700,
      "7680x4320": 1600,
    },
  },
  {
    name: "ProRes 422 Proxy",
    value: "prores-422-proxy",
    bitrates: {
      "1920x1080": 45,
      "3840x2160": 180,
      "4096x2160": 192,
      "5120x2880": 310,
      "7680x4320": 720,
    },
  },
  {
    name: "H.264 (High Quality)",
    value: "h264-high",
    bitrates: {
      "1920x1080": 20,
      "3840x2160": 45,
      "4096x2160": 50,
      "5120x2880": 80,
      "7680x4320": 150,
    },
  },
  {
    name: "H.264 (Medium Quality)",
    value: "h264-medium",
    bitrates: {
      "1920x1080": 10,
      "3840x2160": 25,
      "4096x2160": 30,
      "5120x2880": 45,
      "7680x4320": 80,
    },
  },
  {
    name: "H.265/HEVC (High Quality)",
    value: "h265-high",
    bitrates: {
      "1920x1080": 10,
      "3840x2160": 25,
      "4096x2160": 30,
      "5120x2880": 45,
      "7680x4320": 80,
    },
  },
  {
    name: "H.265/HEVC (Medium Quality)",
    value: "h265-medium",
    bitrates: {
      "1920x1080": 5,
      "3840x2160": 15,
      "4096x2160": 18,
      "5120x2880": 30,
      "7680x4320": 50,
    },
  },
  {
    name: "BRAW 3:1",
    value: "braw-3-1",
    bitrates: {
      "1920x1080": 26,
      "3840x2160": 104,
      "4096x2160": 111,
      "5120x2880": 178,
      "7680x4320": 416,
    },
  },
  {
    name: "BRAW 5:1",
    value: "braw-5-1",
    bitrates: {
      "1920x1080": 16,
      "3840x2160": 64,
      "4096x2160": 68,
      "5120x2880": 109,
      "7680x4320": 256,
    },
  },
  {
    name: "BRAW 8:1",
    value: "braw-8-1",
    bitrates: {
      "1920x1080": 10,
      "3840x2160": 40,
      "4096x2160": 43,
      "5120x2880": 68,
      "7680x4320": 160,
    },
  },
  {
    name: "BRAW 12:1",
    value: "braw-12-1",
    bitrates: {
      "1920x1080": 7,
      "3840x2160": 27,
      "4096x2160": 29,
      "5120x2880": 46,
      "7680x4320": 108,
    },
  },
]

// Resolution options
const resolutions = [
  { name: "HD (1920×1080)", value: "1920x1080" },
  { name: "4K UHD (3840×2160)", value: "3840x2160" },
  { name: "4K DCI (4096×2160)", value: "4096x2160" },
  { name: "5K (5120×2880)", value: "5120x2880" },
  { name: "8K (7680×4320)", value: "7680x4320" },
]

// Storage options
const storageOptions = [
  { name: "128 GB", value: 128 },
  { name: "256 GB", value: 256 },
  { name: "512 GB", value: 512 },
  { name: "1 TB", value: 1024 },
  { name: "2 TB", value: 2048 },
  { name: "4 TB", value: 4096 },
  { name: "8 TB", value: 8192 },
  { name: "16 TB", value: 16384 },
  { name: "32 TB", value: 32768 },
]

// Calculate storage in GB
const calculateStorage = (codec: string, resolution: string, duration: number, fps: number) => {
  const selectedCodec = codecData.find((c) => c.value === codec)
  if (!selectedCodec) return 0

  const bitrate = selectedCodec.bitrates[resolution as keyof typeof selectedCodec.bitrates] || 0

  // Convert Mbps to GB per second, then multiply by duration
  // Formula: (bitrate in Mbps / 8) * duration in seconds / 1024 = GB
  const durationInSeconds = duration * 60
  const storageGB = ((bitrate / 8) * durationInSeconds) / 1024

  return storageGB
}

// Calculate duration in minutes that can fit on a drive
const calculateDuration = (codec: string, resolution: string, storageGB: number, fps: number) => {
  const selectedCodec = codecData.find((c) => c.value === codec)
  if (!selectedCodec) return 0

  const bitrate = selectedCodec.bitrates[resolution as keyof typeof selectedCodec.bitrates] || 0

  // Convert GB to minutes
  // Formula: (storageGB * 1024 * 8) / (bitrate in Mbps) / 60 = minutes
  const durationInMinutes = (storageGB * 1024 * 8) / bitrate / 60

  return durationInMinutes
}

export default function StorageCalculator() {
  const [codec, setCodec] = useState<string>("prores-422")
  const [resolution, setResolution] = useState<string>("1920x1080")
  const [duration, setDuration] = useState<number>(10)
  const [fps, setFps] = useState<number>(24)
  const [storageSize, setStorageSize] = useState<number>(1024)
  const [activeTab, setActiveTab] = useState<string>("calculate-storage")
  const [comparisonCodecs, setComparisonCodecs] = useState<string[]>(["prores-422", "h264-high", "h265-high"])

  const [calculatedStorage, setCalculatedStorage] = useState<number>(0)
  const [calculatedDuration, setCalculatedDuration] = useState<number>(0)

  // Calculate storage when inputs change
  useEffect(() => {
    const storage = calculateStorage(codec, resolution, duration, fps)
    setCalculatedStorage(storage)
  }, [codec, resolution, duration, fps])

  // Calculate duration when inputs change
  useEffect(() => {
    const duration = calculateDuration(codec, resolution, storageSize, fps)
    setCalculatedDuration(duration)
  }, [codec, resolution, storageSize, fps])

  // Generate comparison data for chart
  const generateComparisonData = () => {
    return comparisonCodecs.map((codecValue) => {
      const codecInfo = codecData.find((c) => c.value === codecValue)
      return {
        name: codecInfo?.name || codecValue,
        storage: calculateStorage(codecValue, resolution, duration, fps).toFixed(2),
      }
    })
  }

  // Format time in hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return `${hours}h ${mins}m`
  }

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculate-storage">Calculate Storage</TabsTrigger>
          <TabsTrigger value="calculate-duration">Calculate Duration</TabsTrigger>
        </TabsList>

        {/* Calculate Storage Tab */}
        <TabsContent value="calculate-storage">
          <Card>
            <CardHeader>
              <CardTitle>Estimate Storage Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-2">
                {/* Input section */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="codec">Codec</Label>
                    <Select value={codec} onValueChange={setCodec}>
                      <SelectTrigger id="codec">
                        <SelectValue placeholder="Select codec" />
                      </SelectTrigger>
                      <SelectContent>
                        {codecData.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resolution">Resolution</Label>
                    <Select value={resolution} onValueChange={setResolution}>
                      <SelectTrigger id="resolution">
                        <SelectValue placeholder="Select resolution" />
                      </SelectTrigger>
                      <SelectContent>
                        {resolutions.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={duration}
                      onChange={(e) => setDuration(Number.parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fps">Frame Rate (fps)</Label>
                    <Select value={fps.toString()} onValueChange={(value) => setFps(Number.parseInt(value))}>
                      <SelectTrigger id="fps">
                        <SelectValue placeholder="Select frame rate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="23.976">23.976 fps</SelectItem>
                        <SelectItem value="24">24 fps</SelectItem>
                        <SelectItem value="25">25 fps</SelectItem>
                        <SelectItem value="29.97">29.97 fps</SelectItem>
                        <SelectItem value="30">30 fps</SelectItem>
                        <SelectItem value="50">50 fps</SelectItem>
                        <SelectItem value="59.94">59.94 fps</SelectItem>
                        <SelectItem value="60">60 fps</SelectItem>
                        <SelectItem value="120">120 fps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Results section */}
                <div className="space-y-6">
                  <div className="rounded-lg border p-6 text-center">
                    <div className="text-muted-foreground mb-2">Estimated Storage Required</div>
                    <div className="text-4xl font-bold">{calculatedStorage.toFixed(2)} GB</div>
                    <div className="text-muted-foreground mt-2">{(calculatedStorage / 1024).toFixed(2)} TB</div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Storage Comparison</h3>
                    <div className="h-[300px]">
                      <ChartContainer
                        config={{
                          storage: {
                            label: "Storage (GB)",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={generateComparisonData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="storage" name="Storage (GB)" fill="var(--color-storage)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>

                    <div className="space-y-2">
                      <Label>Compare with other codecs</Label>
                      <div className="flex flex-wrap gap-2">
                        {codecData.map((c) => (
                          <Button
                            key={c.value}
                            variant={comparisonCodecs.includes(c.value) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              if (comparisonCodecs.includes(c.value)) {
                                if (comparisonCodecs.length > 1) {
                                  setComparisonCodecs(comparisonCodecs.filter((cc) => cc !== c.value))
                                }
                              } else {
                                if (comparisonCodecs.length < 5) {
                                  setComparisonCodecs([...comparisonCodecs, c.value])
                                }
                              }
                            }}
                          >
                            {c.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calculate Duration Tab */}
        <TabsContent value="calculate-duration">
          <Card>
            <CardHeader>
              <CardTitle>Calculate Recording Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-2">
                {/* Input section */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="storage-codec">Codec</Label>
                    <Select value={codec} onValueChange={setCodec}>
                      <SelectTrigger id="storage-codec">
                        <SelectValue placeholder="Select codec" />
                      </SelectTrigger>
                      <SelectContent>
                        {codecData.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storage-resolution">Resolution</Label>
                    <Select value={resolution} onValueChange={setResolution}>
                      <SelectTrigger id="storage-resolution">
                        <SelectValue placeholder="Select resolution" />
                      </SelectTrigger>
                      <SelectContent>
                        {resolutions.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storage-size">Storage Size</Label>
                    <Select
                      value={storageSize.toString()}
                      onValueChange={(value) => setStorageSize(Number.parseInt(value))}
                    >
                      <SelectTrigger id="storage-size">
                        <SelectValue placeholder="Select storage size" />
                      </SelectTrigger>
                      <SelectContent>
                        {storageOptions.map((s) => (
                          <SelectItem key={s.value} value={s.value.toString()}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storage-fps">Frame Rate (fps)</Label>
                    <Select value={fps.toString()} onValueChange={(value) => setFps(Number.parseInt(value))}>
                      <SelectTrigger id="storage-fps">
                        <SelectValue placeholder="Select frame rate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="23.976">23.976 fps</SelectItem>
                        <SelectItem value="24">24 fps</SelectItem>
                        <SelectItem value="25">25 fps</SelectItem>
                        <SelectItem value="29.97">29.97 fps</SelectItem>
                        <SelectItem value="30">30 fps</SelectItem>
                        <SelectItem value="50">50 fps</SelectItem>
                        <SelectItem value="59.94">59.94 fps</SelectItem>
                        <SelectItem value="60">60 fps</SelectItem>
                        <SelectItem value="120">120 fps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Results section */}
                <div className="space-y-6">
                  <div className="rounded-lg border p-6 text-center">
                    <div className="text-muted-foreground mb-2">Recording Time Available</div>
                    <div className="text-4xl font-bold">{formatTime(calculatedDuration)}</div>
                    <div className="text-muted-foreground mt-2">{Math.round(calculatedDuration)} minutes</div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Storage Recommendations</h3>
                    <div className="space-y-2">
                      {calculatedDuration < 60 && (
                        <Card className="p-4 bg-yellow-500/10 border-yellow-500/50">
                          <p className="text-sm">
                            <span className="font-medium">Limited recording time.</span> Consider using a more efficient
                            codec or larger storage.
                          </p>
                        </Card>
                      )}

                      {calculatedDuration > 1440 && (
                        <Card className="p-4 bg-green-500/10 border-green-500/50">
                          <p className="text-sm">
                            <span className="font-medium">Plenty of storage available.</span> You have more than 24
                            hours of recording time.
                          </p>
                        </Card>
                      )}

                      <Card className="p-4">
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="font-medium">
                              Recommended for {resolutions.find((r) => r.value === resolution)?.name}:
                            </span>
                          </p>
                          <ul className="text-sm space-y-1">
                            <li>• {codecData.find((c) => c.value === "prores-422-proxy")?.name} for proxy editing</li>
                            <li>• {codecData.find((c) => c.value === "h265-high")?.name} for delivery</li>
                            <li>• {codecData.find((c) => c.value === "prores-422")?.name} for mastering</li>
                          </ul>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Storage tips */}
      <div className="space-y-4">
        <h3 className="text-xl font-medium">Storage Tips</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>RAID Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                For video editing, RAID 0 provides the fastest speeds but no redundancy. RAID 5 or 10 offer a balance of
                speed and data protection.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Proxy Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create lower-resolution proxy files for editing, then relink to high-resolution originals for final
                export to save storage space.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Archive Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use LTO tapes or cloud storage for long-term archiving of completed projects to free up working storage.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

