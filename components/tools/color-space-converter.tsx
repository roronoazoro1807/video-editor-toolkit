"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon, CopyIcon, CheckIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export function ColorSpaceConverter() {
  // Color space options
  const colorSpaces = [
    { id: "rec709", name: "Rec.709 (HD)" },
    { id: "rec2020", name: "Rec.2020 (UHD)" },
    { id: "dci-p3", name: "DCI-P3 (Digital Cinema)" },
    { id: "srgb", name: "sRGB (Web)" },
    { id: "adobe-rgb", name: "Adobe RGB" },
    { id: "display-p3", name: "Display P3 (Apple)" },
  ];

  // State for source and target color spaces
  const [sourceColorSpace, setSourceColorSpace] = useState("rec709");
  const [targetColorSpace, setTargetColorSpace] = useState("rec2020");
  
  // State for RGB values
  const [sourceRGB, setSourceRGB] = useState({ r: 255, g: 0, b: 0 });
  const [targetRGB, setTargetRGB] = useState({ r: 255, g: 0, b: 0 });
  
  // State for hex values
  const [sourceHex, setSourceHex] = useState("#FF0000");
  const [targetHex, setTargetHex] = useState("#FF0000");
  
  // State for copy button
  const [copied, setCopied] = useState(false);
  
  // State for preview image
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // State for color picker
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  };

  // Convert Hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  // Handle RGB input change
  const handleRGBChange = (channel: string, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 255) {
      const newSourceRGB = { ...sourceRGB, [channel]: numValue };
      setSourceRGB(newSourceRGB);
      setSourceHex(rgbToHex(newSourceRGB.r, newSourceRGB.g, newSourceRGB.b));
    }
  };

  // Handle Hex input change
  const handleHexChange = (value: string) => {
    if (/^#?([a-f\d]{6})$/i.test(value)) {
      const cleanHex = value.startsWith("#") ? value : `#${value}`;
      setSourceHex(cleanHex.toUpperCase());
      setSourceRGB(hexToRgb(cleanHex));
    }
  };

  // Simulate color space conversion (in a real app, this would use color management libraries)
  useEffect(() => {
    // This is a simplified simulation of color space conversion
    // In a real application, you would use a proper color management library
    
    // For demonstration purposes, we'll just make some adjustments based on the target color space
    let adjustedRGB = { ...sourceRGB };
    
    if (sourceColorSpace === targetColorSpace) {
      // No conversion needed
      adjustedRGB = { ...sourceRGB };
    } else if (targetColorSpace === "rec2020" && sourceColorSpace === "rec709") {
      // Simulate Rec.709 to Rec.2020 (wider gamut)
      // This is just a visual approximation for demonstration
      adjustedRGB = {
        r: Math.min(255, Math.round(sourceRGB.r * 1.05)),
        g: Math.min(255, Math.round(sourceRGB.g * 1.1)),
        b: Math.min(255, Math.round(sourceRGB.b * 1.15)),
      };
    } else if (targetColorSpace === "dci-p3" && sourceColorSpace === "rec709") {
      // Simulate Rec.709 to DCI-P3 (wider gamut, especially in greens)
      adjustedRGB = {
        r: Math.min(255, Math.round(sourceRGB.r * 1.08)),
        g: Math.min(255, Math.round(sourceRGB.g * 1.15)),
        b: Math.min(255, Math.round(sourceRGB.b * 1.05)),
      };
    } else if (targetColorSpace === "rec709" && (sourceColorSpace === "rec2020" || sourceColorSpace === "dci-p3")) {
      // Simulate conversion from wider gamut to Rec.709 (narrower gamut)
      // This might result in clipping of saturated colors
      const factor = sourceColorSpace === "rec2020" ? 0.95 : 0.92;
      adjustedRGB = {
        r: Math.round(sourceRGB.r * factor),
        g: Math.round(sourceRGB.g * factor),
        b: Math.round(sourceRGB.b * factor),
      };
    }
    
    setTargetRGB(adjustedRGB);
    setTargetHex(rgbToHex(adjustedRGB.r, adjustedRGB.g, adjustedRGB.b));
    
  }, [sourceRGB, sourceColorSpace, targetColorSpace]);

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="converter" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="converter">Color Converter</TabsTrigger>
          <TabsTrigger value="guide">Color Space Guide</TabsTrigger>
        </TabsList>
        
        <TabsContent value="converter" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Source Color */}
            <Card>
              <CardHeader>
                <CardTitle>Source Color</CardTitle>
                <CardDescription>
                  Enter the color values in your source color space
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="sourceColorSpace">Source Color Space</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <InfoIcon className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>The color space your content is currently in. This defines the range of colors (gamut) that can be represented.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select value={sourceColorSpace} onValueChange={setSourceColorSpace}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color space" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorSpaces.map((space) => (
                        <SelectItem key={space.id} value={space.id}>
                          {space.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sourceHex">Hex Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="sourceHex"
                      value={sourceHex}
                      onChange={(e) => handleHexChange(e.target.value)}
                      className="font-mono"
                    />
                    <div 
                      className="h-10 w-10 rounded-md border cursor-pointer"
                      style={{ backgroundColor: sourceHex }}
                      onClick={() => setShowColorPicker(!showColorPicker)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sourceR">R</Label>
                    <Input
                      id="sourceR"
                      type="number"
                      min="0"
                      max="255"
                      value={sourceRGB.r}
                      onChange={(e) => handleRGBChange("r", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sourceG">G</Label>
                    <Input
                      id="sourceG"
                      type="number"
                      min="0"
                      max="255"
                      value={sourceRGB.g}
                      onChange={(e) => handleRGBChange("g", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sourceB">B</Label>
                    <Input
                      id="sourceB"
                      type="number"
                      min="0"
                      max="255"
                      value={sourceRGB.b}
                      onChange={(e) => handleRGBChange("b", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>RGB Sliders</Label>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-red-500">R</span>
                        <span className="text-sm">{sourceRGB.r}</span>
                      </div>
                      <Slider
                        min={0}
                        max={255}
                        step={1}
                        value={[sourceRGB.r]}
                        onValueChange={(value) => handleRGBChange("r", value[0].toString())}
                        className="[&>span:first-child]:bg-red-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-500">G</span>
                        <span className="text-sm">{sourceRGB.g}</span>
                      </div>
                      <Slider
                        min={0}
                        max={255}
                        step={1}
                        value={[sourceRGB.g]}
                        onValueChange={(value) => handleRGBChange("g", value[0].toString())}
                        className="[&>span:first-child]:bg-green-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-500">B</span>
                        <span className="text-sm">{sourceRGB.b}</span>
                      </div>
                      <Slider
                        min={0}
                        max={255}
                        step={1}
                        value={[sourceRGB.b]}
                        onValueChange={(value) => handleRGBChange("b", value[0].toString())}
                        className="[&>span:first-child]:bg-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Target Color */}
            <Card>
              <CardHeader>
                <CardTitle>Converted Color</CardTitle>
                <CardDescription>
                  View the converted color in your target color space
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="targetColorSpace">Target Color Space</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <InfoIcon className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>The color space you want to convert to. Converting from a wider gamut (like Rec.2020) to a narrower one (like Rec.709) may result in color clipping.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select value={targetColorSpace} onValueChange={setTargetColorSpace}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color space" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorSpaces.map((space) => (
                        <SelectItem key={space.id} value={space.id}>
                          {space.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="targetHex">Hex Color</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(targetHex)}
                          >
                            {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy hex value</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      id="targetHex"
                      value={targetHex}
                      readOnly
                      className="font-mono"
                    />
                    <div 
                      className="h-10 w-10 rounded-md border"
                      style={{ backgroundColor: targetHex }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetR">R</Label>
                    <Input
                      id="targetR"
                      value={targetRGB.r}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetG">G</Label>
                    <Input
                      id="targetG"
                      value={targetRGB.g}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetB">B</Label>
                    <Input
                      id="targetB"
                      value={targetRGB.b}
                      readOnly
                    />
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <Label>Color Preview</Label>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 rounded-md border p-2 text-center text-sm">
                        Source: {colorSpaces.find(s => s.id === sourceColorSpace)?.name}
                      </div>
                      <div 
                        className="h-16 w-16 rounded-md border"
                        style={{ backgroundColor: sourceHex }}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 rounded-md border p-2 text-center text-sm">
                        Target: {colorSpaces.find(s => s.id === targetColorSpace)?.name}
                      </div>
                      <div 
                        className="h-16 w-16 rounded-md border"
                        style={{ backgroundColor: targetHex }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Color Space Comparison</CardTitle>
              <CardDescription>
                Visual representation of how the same color appears in different color spaces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                {colorSpaces.map((space) => (
                  <div key={space.id} className="flex flex-col items-center gap-2">
                    <div 
                      className="h-16 w-16 rounded-md border"
                      style={{ 
                        backgroundColor: space.id === sourceColorSpace 
                          ? sourceHex 
                          : space.id === targetColorSpace 
                            ? targetHex 
                            : sourceHex // In a real app, would convert to each space
                      }}
                    />
                    <div className="text-center text-xs">{space.name}</div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Note: This is a simplified visualization. Actual color appearance depends on your display&apos;s color profile and calibration.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Understanding Color Spaces</CardTitle>
              <CardDescription>
                Learn about different color spaces and their applications in video production
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">What is a Color Space?</h3>
                <p>
                  A color space is a specific organization of colors that allows for reproducible representations of color. 
                  Different color spaces have different gamuts (ranges of colors they can represent) and are used for different purposes in video production.
                </p>
                
                <h3 className="text-lg font-semibold">Common Color Spaces</h3>
                <div className="space-y-3">
                  <div className="rounded-md border p-4">
                    <div className="font-medium">Rec.709 (BT.709)</div>
                    <p className="text-sm text-muted-foreground">
                      The standard color space for HDTV. Has a relatively narrow gamut compared to newer standards.
                      Used for most broadcast television, streaming content, and Blu-ray discs.
                    </p>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <div className="font-medium">Rec.2020 (BT.2020)</div>
                    <p className="text-sm text-muted-foreground">
                      A wide color gamut standard used for UHD content. Can represent a much larger range of colors than Rec.709.
                      Used for 4K/8K content and HDR video.
                    </p>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <div className="font-medium">DCI-P3</div>
                    <p className="text-sm text-muted-foreground">
                      The color space used in digital cinema projection. Has a wider gamut than Rec.709, especially in greens and reds.
                      Used for theatrical releases and increasingly for HDR content on consumer displays.
                    </p>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <div className="font-medium">sRGB</div>
                    <p className="text-sm text-muted-foreground">
                      The standard color space for the web and most computer displays. Very similar to Rec.709 in terms of gamut.
                      Used for web content, social media, and most consumer photography.
                    </p>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold">Color Space Conversion Challenges</h3>
                <p>
                  When converting between color spaces with different gamuts, colors that exist in the wider gamut but not in the narrower one must be mapped to colors that can be represented.
                  This process, called gamut mapping, can result in loss of color information and saturation.
                </p>
                
                <div className="rounded-md border p-4 bg-muted/50">
                  <h4 className="font-medium">Best Practices</h4>
                  <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                    <li>Work in the widest color space your project requires</li>
                    <li>Convert to narrower color spaces as late in the workflow as possible</li>
                    <li>Use proper color management in your editing software</li>
                    <li>Consider the target display when choosing a color space</li>
                    <li>Use calibrated monitors for color-critical work</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 