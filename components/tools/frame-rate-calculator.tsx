"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

export function FrameRateCalculator() {
  // State for frame rate
  const [frameRate, setFrameRate] = useState(24);
  const [customFrameRate, setCustomFrameRate] = useState(24);
  
  // State for shutter angle
  const [shutterAngle, setShutterAngle] = useState(180);
  const [customShutterAngle, setCustomShutterAngle] = useState(180);
  
  // State for shutter speed
  const [shutterSpeed, setShutterSpeed] = useState("1/48");
  const [shutterSpeedFraction, setShutterSpeedFraction] = useState(48);
  
  // State for motion blur preview
  const [motionBlurLevel, setMotionBlurLevel] = useState("standard");
  
  // Common frame rates
  const commonFrameRates = [
    { value: 24, label: "24 fps (Film)" },
    { value: 25, label: "25 fps (PAL)" },
    { value: 30, label: "30 fps (NTSC)" },
    { value: 50, label: "50 fps (PAL High Speed)" },
    { value: 60, label: "60 fps (NTSC High Speed)" },
    { value: 120, label: "120 fps (Slow Motion)" },
  ];
  
  // Common shutter angles
  const commonShutterAngles = [
    { value: 180, label: "180° (Standard)" },
    { value: 90, label: "90° (Sharp Motion)" },
    { value: 270, label: "270° (Increased Blur)" },
    { value: 360, label: "360° (Maximum Blur)" },
  ];

  // Calculate shutter speed based on frame rate and shutter angle
  useEffect(() => {
    // Formula: shutter speed = 1 / (frame rate * (shutter angle / 360))
    const denominator = Math.round(frameRate * (shutterAngle / 360));
    setShutterSpeedFraction(denominator);
    setShutterSpeed(`1/${denominator}`);
    
    // Determine motion blur level
    if (shutterAngle <= 90) {
      setMotionBlurLevel("minimal");
    } else if (shutterAngle <= 170) {
      setMotionBlurLevel("reduced");
    } else if (shutterAngle <= 190) {
      setMotionBlurLevel("standard");
    } else if (shutterAngle <= 270) {
      setMotionBlurLevel("increased");
    } else {
      setMotionBlurLevel("heavy");
    }
  }, [frameRate, shutterAngle]);

  // Handle custom frame rate change
  const handleCustomFrameRateChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setCustomFrameRate(numValue);
    }
  };

  // Handle custom shutter angle change
  const handleCustomShutterAngleChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 360) {
      setCustomShutterAngle(numValue);
    }
  };

  // Apply custom frame rate
  const applyCustomFrameRate = () => {
    setFrameRate(customFrameRate);
  };

  // Apply custom shutter angle
  const applyCustomShutterAngle = () => {
    setShutterAngle(customShutterAngle);
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="guide">Shutter Speed Guide</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frame Rate Selection</CardTitle>
              <CardDescription>
                Choose a common frame rate or enter a custom value
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {commonFrameRates.map((rate) => (
                  <Button
                    key={rate.value}
                    variant={frameRate === rate.value ? "default" : "outline"}
                    onClick={() => setFrameRate(rate.value)}
                    className="w-full"
                  >
                    {rate.label}
                  </Button>
                ))}
              </div>
              
              <div className="flex items-end gap-2 mt-4">
                <div className="flex-1">
                  <Label htmlFor="customFrameRate">Custom Frame Rate (fps)</Label>
                  <Input
                    id="customFrameRate"
                    type="number"
                    min="1"
                    step="0.001"
                    value={customFrameRate}
                    onChange={(e) => handleCustomFrameRateChange(e.target.value)}
                  />
                </div>
                <Button onClick={applyCustomFrameRate}>Apply</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Shutter Angle</CardTitle>
              <CardDescription>
                Select a shutter angle to determine motion blur characteristics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                {commonShutterAngles.map((angle) => (
                  <Button
                    key={angle.value}
                    variant={shutterAngle === angle.value ? "default" : "outline"}
                    onClick={() => setShutterAngle(angle.value)}
                    className="w-full"
                  >
                    {angle.label}
                  </Button>
                ))}
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="shutterAngleSlider">Custom Shutter Angle: {shutterAngle}°</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <InfoIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>The shutter angle determines how long the shutter stays open relative to the frame rate. 
                        180° is standard for natural motion blur, lower values create sharper motion, higher values increase blur.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Slider
                  id="shutterAngleSlider"
                  min={1}
                  max={360}
                  step={1}
                  value={[shutterAngle]}
                  onValueChange={(value) => setShutterAngle(value[0])}
                />
              </div>
              
              <div className="flex items-end gap-2 mt-4">
                <div className="flex-1">
                  <Label htmlFor="customShutterAngle">Custom Shutter Angle (°)</Label>
                  <Input
                    id="customShutterAngle"
                    type="number"
                    min="1"
                    max="360"
                    step="0.1"
                    value={customShutterAngle}
                    onChange={(e) => handleCustomShutterAngleChange(e.target.value)}
                  />
                </div>
                <Button onClick={applyCustomShutterAngle}>Apply</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>
                Calculated shutter speed and motion blur characteristics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Calculated Shutter Speed</Label>
                  <div className="text-4xl font-bold">{shutterSpeed}</div>
                  <p className="text-sm text-muted-foreground">
                    Based on {frameRate} fps and {shutterAngle}° shutter angle
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Motion Blur Characteristics</Label>
                  <div className="text-2xl font-semibold capitalize">{motionBlurLevel} Motion Blur</div>
                  <p className="text-sm text-muted-foreground">
                    {motionBlurLevel === "minimal" && "Very sharp motion with minimal blur. Good for technical or analytical footage."}
                    {motionBlurLevel === "reduced" && "Reduced motion blur for slightly sharper movement while maintaining some natural feel."}
                    {motionBlurLevel === "standard" && "Standard cinematic motion blur. Follows the 180° shutter rule for natural-looking movement."}
                    {motionBlurLevel === "increased" && "Increased motion blur for a more dreamy or fluid look. Can help smooth motion."}
                    {motionBlurLevel === "heavy" && "Heavy motion blur for stylistic effect. May make fast movement difficult to discern."}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Label>Equivalent Settings</Label>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                  <div className="rounded-md border p-3">
                    <div className="text-sm font-medium">Exposure Time</div>
                    <div className="text-lg">{(1 / shutterSpeedFraction).toFixed(4)} seconds</div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-sm font-medium">Degrees of Rotation</div>
                    <div className="text-lg">{shutterAngle}°</div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-sm font-medium">Percentage</div>
                    <div className="text-lg">{Math.round((shutterAngle / 360) * 100)}%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Understanding Shutter Speed & Frame Rate</CardTitle>
              <CardDescription>
                Learn how shutter speed affects the look and feel of your footage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">The 180° Shutter Rule</h3>
                <p>
                  The 180° shutter rule is a guideline that suggests your shutter speed should be approximately 1/(2 × frame rate). 
                  This creates natural-looking motion blur that audiences are accustomed to from traditional film.
                </p>
                
                <h3 className="text-lg font-semibold">Creative Applications</h3>
                <div className="space-y-2">
                  <div className="rounded-md border p-3">
                    <div className="font-medium">90° Shutter (1/4 × frame rate)</div>
                    <p className="text-sm text-muted-foreground">
                      Creates sharper, more staccato motion with reduced blur. Often used in action sequences or to create tension.
                      Example: "Saving Private Ryan" battle scenes.
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="font-medium">180° Shutter (1/2 × frame rate)</div>
                    <p className="text-sm text-muted-foreground">
                      Standard cinematic look with natural motion blur. The most commonly used setting for narrative filmmaking.
                      Example: Most Hollywood films.
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="font-medium">270° Shutter (3/4 × frame rate)</div>
                    <p className="text-sm text-muted-foreground">
                      Increased motion blur for a more fluid, dreamy look. Can help smooth out camera movement.
                      Example: Dream sequences or flashbacks.
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="font-medium">360° Shutter (1 × frame rate)</div>
                    <p className="text-sm text-muted-foreground">
                      Maximum motion blur, creating a very smeared look during movement. Used for specific stylistic effects.
                      Example: Artistic music videos or to simulate intoxication.
                    </p>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold">Common Frame Rates & Their Uses</h3>
                <div className="space-y-2">
                  <div className="rounded-md border p-3">
                    <div className="font-medium">24 fps</div>
                    <p className="text-sm text-muted-foreground">
                      The standard for cinema and narrative filmmaking. Creates the "film look" audiences associate with movies.
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="font-medium">25/30 fps</div>
                    <p className="text-sm text-muted-foreground">
                      Traditional broadcast standards (PAL/NTSC). Often used for TV production, documentaries, and interviews.
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="font-medium">50/60 fps</div>
                    <p className="text-sm text-muted-foreground">
                      High frame rate used for sports, documentary, or to be slowed down slightly for smooth slow motion.
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="font-medium">120+ fps</div>
                    <p className="text-sm text-muted-foreground">
                      Used primarily for slow-motion footage. When played back at standard speeds, creates dramatic slow-motion effects.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 