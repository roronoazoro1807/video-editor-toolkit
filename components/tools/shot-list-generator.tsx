"use client"

import { useState } from "react"
import { Download, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Shot types
const shotTypes = [
  "Wide Shot (WS)",
  "Medium Shot (MS)",
  "Close-Up (CU)",
  "Extreme Close-Up (ECU)",
  "Over The Shoulder (OTS)",
  "Point of View (POV)",
  "Two Shot",
  "Establishing Shot",
  "Aerial Shot",
  "Tracking Shot",
  "Dolly Shot",
  "Crane Shot",
  "Handheld",
  "Steadicam",
  "Dutch Angle",
  "Low Angle",
  "High Angle",
  "Insert Shot",
  "Cutaway",
]

// Camera movement types
const cameraMovements = [
  "Static",
  "Pan Left",
  "Pan Right",
  "Tilt Up",
  "Tilt Down",
  "Dolly In",
  "Dolly Out",
  "Truck Left",
  "Truck Right",
  "Pedestal Up",
  "Pedestal Down",
  "Arc",
  "Orbit",
  "Zoom In",
  "Zoom Out",
  "Handheld",
  "Steadicam",
  "Gimbal",
  "Drone",
  "Jib/Crane",
]

// Equipment options
const equipmentOptions = [
  "Camera Body",
  "Prime Lens",
  "Zoom Lens",
  "Tripod",
  "Monopod",
  "Gimbal",
  "Steadicam",
  "Dolly",
  "Slider",
  "Jib/Crane",
  "Drone",
  "LED Panels",
  "Fresnel Lights",
  "Softboxes",
  "Reflectors",
  "Diffusion",
  "Lavalier Mic",
  "Boom Mic",
  "Audio Recorder",
  "Green Screen",
]

// Default empty shot
const defaultShot = {
  id: "",
  sceneNumber: "",
  shotNumber: "",
  description: "",
  shotType: "",
  cameraMovement: "Static",
  equipment: [],
  frameRate: "24",
  estimatedTime: 15,
  notes: "",
}

export default function ShotListGenerator() {
  const [projectTitle, setProjectTitle] = useState<string>("Untitled Project")
  const [director, setDirector] = useState<string>("")
  const [dop, setDop] = useState<string>("")
  const [shootDate, setShootDate] = useState<string>("")
  const [shots, setShots] = useState<any[]>([{ ...defaultShot, id: "1", sceneNumber: "1", shotNumber: "1" }])
  const [activeTab, setActiveTab] = useState<string>("shot-list")

  // Add a new shot
  const addShot = () => {
    const lastShot = shots[shots.length - 1]
    const newId = (Number.parseInt(lastShot.id) + 1).toString()

    // Try to intelligently set the scene and shot numbers
    const newSceneNumber = lastShot.sceneNumber
    const newShotNumber = (Number.parseInt(lastShot.shotNumber) + 1).toString()

    setShots([
      ...shots,
      {
        ...defaultShot,
        id: newId,
        sceneNumber: newSceneNumber,
        shotNumber: newShotNumber,
      },
    ])
  }

  // Remove a shot
  const removeShot = (id: string) => {
    if (shots.length > 1) {
      setShots(shots.filter((shot) => shot.id !== id))
    }
  }

  // Update shot data
  const updateShot = (id: string, field: string, value: any) => {
    setShots(
      shots.map((shot) => {
        if (shot.id === id) {
          return { ...shot, [field]: value }
        }
        return shot
      }),
    )
  }

  // Toggle equipment selection
  const toggleEquipment = (id: string, equipment: string) => {
    setShots(
      shots.map((shot) => {
        if (shot.id === id) {
          const updatedEquipment = shot.equipment.includes(equipment)
            ? shot.equipment.filter((e: string) => e !== equipment)
            : [...shot.equipment, equipment]
          return { ...shot, equipment: updatedEquipment }
        }
        return shot
      }),
    )
  }

  // Calculate total estimated time
  const totalEstimatedTime = shots.reduce((total, shot) => total + (Number.parseInt(shot.estimatedTime) || 0), 0)

  // Format time in hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Generate PDF
  const generatePDF = () => {
    // In a real implementation, this would generate a PDF
    alert("PDF generation would be implemented here")
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-title">Project Title</Label>
              <Input id="project-title" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shoot-date">Shoot Date</Label>
              <Input id="shoot-date" type="date" value={shootDate} onChange={(e) => setShootDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="director">Director</Label>
              <Input id="director" value={director} onChange={(e) => setDirector(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dop">Director of Photography</Label>
              <Input id="dop" value={dop} onChange={(e) => setDop(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="shot-list">Shot List</TabsTrigger>
          <TabsTrigger value="storyboard">Storyboard View</TabsTrigger>
        </TabsList>

        {/* Shot List Tab */}
        <TabsContent value="shot-list">
          <div className="space-y-4">
            {shots.map((shot) => (
              <Card key={shot.id} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => removeShot(shot.id)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove shot</span>
                </Button>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    Scene {shot.sceneNumber} - Shot {shot.shotNumber}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor={`scene-${shot.id}`}>Scene #</Label>
                      <Input
                        id={`scene-${shot.id}`}
                        value={shot.sceneNumber}
                        onChange={(e) => updateShot(shot.id, "sceneNumber", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`shot-${shot.id}`}>Shot #</Label>
                      <Input
                        id={`shot-${shot.id}`}
                        value={shot.shotNumber}
                        onChange={(e) => updateShot(shot.id, "shotNumber", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`type-${shot.id}`}>Shot Type</Label>
                      <Select value={shot.shotType} onValueChange={(value) => updateShot(shot.id, "shotType", value)}>
                        <SelectTrigger id={`type-${shot.id}`}>
                          <SelectValue placeholder="Select shot type" />
                        </SelectTrigger>
                        <SelectContent>
                          {shotTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                      <Label htmlFor={`description-${shot.id}`}>Shot Description</Label>
                      <Textarea
                        id={`description-${shot.id}`}
                        value={shot.description}
                        onChange={(e) => updateShot(shot.id, "description", e.target.value)}
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`movement-${shot.id}`}>Camera Movement</Label>
                      <Select
                        value={shot.cameraMovement}
                        onValueChange={(value) => updateShot(shot.id, "cameraMovement", value)}
                      >
                        <SelectTrigger id={`movement-${shot.id}`}>
                          <SelectValue placeholder="Select camera movement" />
                        </SelectTrigger>
                        <SelectContent>
                          {cameraMovements.map((movement) => (
                            <SelectItem key={movement} value={movement}>
                              {movement}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`framerate-${shot.id}`}>Frame Rate</Label>
                      <Select value={shot.frameRate} onValueChange={(value) => updateShot(shot.id, "frameRate", value)}>
                        <SelectTrigger id={`framerate-${shot.id}`}>
                          <SelectValue placeholder="Select frame rate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24">24 fps</SelectItem>
                          <SelectItem value="25">25 fps</SelectItem>
                          <SelectItem value="30">30 fps</SelectItem>
                          <SelectItem value="48">48 fps</SelectItem>
                          <SelectItem value="60">60 fps</SelectItem>
                          <SelectItem value="120">120 fps</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`time-${shot.id}`}>Est. Time (minutes)</Label>
                      <Input
                        id={`time-${shot.id}`}
                        type="number"
                        min="1"
                        value={shot.estimatedTime}
                        onChange={(e) => updateShot(shot.id, "estimatedTime", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                      <Label>Equipment Needed</Label>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {equipmentOptions.map((equipment) => (
                          <Button
                            key={equipment}
                            variant={shot.equipment.includes(equipment) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleEquipment(shot.id, equipment)}
                          >
                            {equipment}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                      <Label htmlFor={`notes-${shot.id}`}>Notes</Label>
                      <Textarea
                        id={`notes-${shot.id}`}
                        value={shot.notes}
                        onChange={(e) => updateShot(shot.id, "notes", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button onClick={addShot} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Shot
            </Button>
          </div>
        </TabsContent>

        {/* Storyboard View Tab */}
        <TabsContent value="storyboard">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shots.map((shot) => (
                <Card key={shot.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <div className="text-muted-foreground">
                      {shot.shotType || "Shot Type"} - {shot.cameraMovement}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="font-medium">
                      Scene {shot.sceneNumber} - Shot {shot.shotNumber}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {shot.description || "No description provided"}
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">Est. Time: {shot.estimatedTime} min</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Shot List Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <div className="text-sm text-muted-foreground">Total Shots</div>
              <div className="text-2xl font-bold">{shots.length}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Scenes</div>
              <div className="text-2xl font-bold">{new Set(shots.map((shot) => shot.sceneNumber)).size}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Estimated Time</div>
              <div className="text-2xl font-bold">{formatTime(totalEstimatedTime)}</div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={generatePDF} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Export Shot List as PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

