"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon, CopyIcon, CheckIcon, PlusIcon, MinusIcon } from "lucide-react";

export function TimecodeCalculator() {
  // Frame rate options
  const frameRates = [
    { value: "23.976", label: "23.976 fps (Film)" },
    { value: "24", label: "24 fps (Film)" },
    { value: "25", label: "25 fps (PAL)" },
    { value: "29.97", label: "29.97 fps (NTSC)" },
    { value: "30", label: "30 fps (NTSC)" },
    { value: "50", label: "50 fps (PAL High Speed)" },
    { value: "59.94", label: "59.94 fps (NTSC High Speed)" },
    { value: "60", label: "60 fps (NTSC High Speed)" },
  ];

  // State for frame rate
  const [frameRate, setFrameRate] = useState("24");
  
  // State for timecode
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [frames, setFrames] = useState("00");
  
  // State for frames count
  const [totalFrames, setTotalFrames] = useState(0);
  
  // State for real-time
  const [realTime, setRealTime] = useState("00:00:00.000");
  
  // State for copy button
  const [copied, setCopied] = useState(false);
  
  // State for calculation mode
  const [calculationMode, setCalculationMode] = useState("timecode-to-frames");
  
  // State for timecode math
  const [timecode1, setTimecode1] = useState({ hours: "00", minutes: "00", seconds: "00", frames: "00" });
  const [timecode2, setTimecode2] = useState({ hours: "00", minutes: "00", seconds: "00", frames: "00" });
  const [resultTimecode, setResultTimecode] = useState({ hours: "00", minutes: "00", seconds: "00", frames: "00" });
  const [operation, setOperation] = useState("add");

  // Format number as two digits
  const formatTwoDigits = (num: number): string => {
    return num.toString().padStart(2, "0");
  };

  // Convert timecode to frames
  const timecodeToFrames = (h: string, m: string, s: string, f: string, fr: string): number => {
    const frFloat = parseFloat(fr);
    const hoursInFrames = parseInt(h) * 60 * 60 * frFloat;
    const minutesInFrames = parseInt(m) * 60 * frFloat;
    const secondsInFrames = parseInt(s) * frFloat;
    const framesCount = parseInt(f);
    
    return Math.round(hoursInFrames + minutesInFrames + secondsInFrames + framesCount);
  };

  // Convert frames to timecode
  const framesToTimecode = (totalFrames: number, fr: string): { h: string; m: string; s: string; f: string } => {
    const frFloat = parseFloat(fr);
    
    const framesPerHour = 60 * 60 * frFloat;
    const framesPerMinute = 60 * frFloat;
    const framesPerSecond = frFloat;
    
    const h = Math.floor(totalFrames / framesPerHour);
    const remainingFrames1 = totalFrames % framesPerHour;
    
    const m = Math.floor(remainingFrames1 / framesPerMinute);
    const remainingFrames2 = remainingFrames1 % framesPerMinute;
    
    const s = Math.floor(remainingFrames2 / framesPerSecond);
    const f = Math.floor(remainingFrames2 % framesPerSecond);
    
    return {
      h: formatTwoDigits(h),
      m: formatTwoDigits(m),
      s: formatTwoDigits(s),
      f: formatTwoDigits(f),
    };
  };

  // Convert timecode to real-time
  const timecodeToRealTime = (h: string, m: string, s: string, f: string, fr: string): string => {
    const frFloat = parseFloat(fr);
    const totalSeconds = parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s) + parseInt(f) / frFloat;
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.round(((totalSeconds % 1) * 1000));
    
    return `${formatTwoDigits(hours)}:${formatTwoDigits(minutes)}:${formatTwoDigits(seconds)}.${milliseconds.toString().padStart(3, "0")}`;
  };

  // Handle timecode input change
  const handleTimecodeChange = (field: string, value: string) => {
    let numValue = parseInt(value);
    
    if (isNaN(numValue)) {
      numValue = 0;
    }
    
    const maxValues: { [key: string]: number } = {
      hours: 99,
      minutes: 59,
      seconds: 59,
      frames: Math.ceil(parseFloat(frameRate)) - 1,
    };
    
    if (numValue > maxValues[field]) {
      numValue = maxValues[field];
    }
    
    const formattedValue = formatTwoDigits(numValue);
    
    switch (field) {
      case "hours":
        setHours(formattedValue);
        break;
      case "minutes":
        setMinutes(formattedValue);
        break;
      case "seconds":
        setSeconds(formattedValue);
        break;
      case "frames":
        setFrames(formattedValue);
        break;
    }
  };

  // Handle frames input change
  const handleFramesChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setTotalFrames(numValue);
    }
  };

  // Handle timecode math input change
  const handleTimecodeInputChange = (tcIndex: number, field: string, value: string) => {
    let numValue = parseInt(value);
    
    if (isNaN(numValue)) {
      numValue = 0;
    }
    
    const maxValues: { [key: string]: number } = {
      hours: 99,
      minutes: 59,
      seconds: 59,
      frames: Math.ceil(parseFloat(frameRate)) - 1,
    };
    
    if (numValue > maxValues[field]) {
      numValue = maxValues[field];
    }
    
    const formattedValue = formatTwoDigits(numValue);
    
    if (tcIndex === 1) {
      setTimecode1({ ...timecode1, [field]: formattedValue });
    } else {
      setTimecode2({ ...timecode2, [field]: formattedValue });
    }
  };

  // Perform timecode math
  const performTimecodeMath = () => {
    const tc1Frames = timecodeToFrames(
      timecode1.hours, timecode1.minutes, timecode1.seconds, timecode1.frames, frameRate
    );
    
    const tc2Frames = timecodeToFrames(
      timecode2.hours, timecode2.minutes, timecode2.seconds, timecode2.frames, frameRate
    );
    
    let resultFrames = 0;
    
    if (operation === "add") {
      resultFrames = tc1Frames + tc2Frames;
    } else {
      resultFrames = Math.max(0, tc1Frames - tc2Frames);
    }
    
    const result = framesToTimecode(resultFrames, frameRate);
    setResultTimecode({
      hours: result.h,
      minutes: result.m,
      seconds: result.s,
      frames: result.f,
    });
  };

  // Update calculations when inputs change
  useEffect(() => {
    // Calculate total frames from timecode
    const framesCount = timecodeToFrames(hours, minutes, seconds, frames, frameRate);
    setTotalFrames(framesCount);
    
    // Calculate real-time from timecode
    const rt = timecodeToRealTime(hours, minutes, seconds, frames, frameRate);
    setRealTime(rt);
  }, [hours, minutes, seconds, frames, frameRate]);

  // Update timecode when total frames change
  useEffect(() => {
    if (calculationMode === "frames-to-timecode") {
      const tc = framesToTimecode(totalFrames, frameRate);
      setHours(tc.h);
      setMinutes(tc.m);
      setSeconds(tc.s);
      setFrames(tc.f);
      
      // Calculate real-time from timecode
      const rt = timecodeToRealTime(tc.h, tc.m, tc.s, tc.f, frameRate);
      setRealTime(rt);
    }
  }, [totalFrames, frameRate, calculationMode]);

  // Update timecode math result when inputs change
  useEffect(() => {
    performTimecodeMath();
  }, [timecode1, timecode2, operation, frameRate]);

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Add keyboard shortcut handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Copy timecode with Ctrl+C when focused on formatted timecode
      if (e.ctrlKey && e.key === 'c' && document.activeElement?.id === 'formattedTimecode') {
        e.preventDefault()
        copyToClipboard(`${hours}:${minutes}:${seconds}:${frames}`)
      }
      
      // Copy frames with Ctrl+C when focused on total frames
      if (e.ctrlKey && e.key === 'c' && document.activeElement?.id === 'totalFrames') {
        e.preventDefault()
        copyToClipboard(totalFrames.toString())
      }
      
      // Copy real time with Ctrl+C when focused on real time
      if (e.ctrlKey && e.key === 'c' && document.activeElement?.id === 'realTime') {
        e.preventDefault()
        copyToClipboard(realTime)
      }
      
      // Toggle between calculation modes with Alt+T
      if (e.altKey && e.key === 't') {
        e.preventDefault()
        setCalculationMode(prev => 
          prev === 'timecode-to-frames' ? 'frames-to-timecode' : 'timecode-to-frames'
        )
      }
      
      // Toggle between add/subtract in timecode math with Alt+A
      if (e.altKey && e.key === 'a' && document.querySelector('[value="calculator"]')?.getAttribute('data-state') === 'active') {
        e.preventDefault()
        setOperation(prev => prev === 'add' ? 'subtract' : 'add')
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hours, minutes, seconds, frames, totalFrames, realTime, copyToClipboard])

  return (
    <div className="space-y-8">
      <Tabs defaultValue="converter" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="converter">Timecode Converter</TabsTrigger>
          <TabsTrigger value="calculator">Timecode Math</TabsTrigger>
          <TabsTrigger value="guide">Timecode Guide</TabsTrigger>
        </TabsList>
        
        <TabsContent value="converter" className="space-y-6">
          <div className="bg-muted/50 border rounded-md p-3 flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium">Keyboard Shortcuts:</span> <span className="text-muted-foreground">Alt+T to toggle calculation mode</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Use Ctrl+C to copy values when focused on an input field</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Frame Rate Selection</CardTitle>
              <CardDescription>
                Choose the frame rate for your timecode calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="frameRate">Frame Rate</Label>
                <Select value={frameRate} onValueChange={setFrameRate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frame rate" />
                  </SelectTrigger>
                  <SelectContent>
                    {frameRates.map((rate) => (
                      <SelectItem key={rate.value} value={rate.value}>
                        {rate.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Timecode</CardTitle>
                <CardDescription>
                  Enter timecode in HH:MM:SS:FF format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="hours">Hours</Label>
                    <Input
                      id="hours"
                      value={hours}
                      onChange={(e) => handleTimecodeChange("hours", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minutes">Minutes</Label>
                    <Input
                      id="minutes"
                      value={minutes}
                      onChange={(e) => handleTimecodeChange("minutes", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seconds">Seconds</Label>
                    <Input
                      id="seconds"
                      value={seconds}
                      onChange={(e) => handleTimecodeChange("seconds", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frames">Frames</Label>
                    <Input
                      id="frames"
                      value={frames}
                      onChange={(e) => handleTimecodeChange("frames", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="formattedTimecode">Formatted Timecode</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(`${hours}:${minutes}:${seconds}:${frames}`)}
                        >
                          {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy timecode</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="formattedTimecode"
                  value={`${hours}:${minutes}:${seconds}:${frames}`}
                  readOnly
                  className="font-mono"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Conversions</CardTitle>
                <CardDescription>
                  View frame count and real-time equivalents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="totalFrames">Total Frames</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(totalFrames.toString())}
                          >
                            {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy frame count</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="totalFrames"
                    value={totalFrames}
                    onChange={(e) => handleFramesChange(e.target.value)}
                    className="font-mono"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="realTime">Real Time (HH:MM:SS.ms)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(realTime)}
                          >
                            {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy real time</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="realTime"
                    value={realTime}
                    readOnly
                    className="font-mono"
                  />
                </div>
                
                <div className="mt-4 space-y-2">
                  <Label>Calculation Mode</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={calculationMode === "timecode-to-frames" ? "default" : "outline"}
                      onClick={() => setCalculationMode("timecode-to-frames")}
                      className="w-full"
                    >
                      Timecode to Frames
                    </Button>
                    <Button
                      variant={calculationMode === "frames-to-timecode" ? "default" : "outline"}
                      onClick={() => setCalculationMode("frames-to-timecode")}
                      className="w-full"
                    >
                      Frames to Timecode
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="calculator" className="space-y-6">
          <div className="bg-muted/50 border rounded-md p-3 flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium">Keyboard Shortcuts:</span> <span className="text-muted-foreground">Alt+A to toggle between add/subtract</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Use Ctrl+C to copy the result when focused on the result field</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Timecode Math</CardTitle>
              <CardDescription>
                Add or subtract timecodes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>First Timecode</Label>
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="tc1Hours">Hours</Label>
                    <Input
                      id="tc1Hours"
                      value={timecode1.hours}
                      onChange={(e) => handleTimecodeInputChange(1, "hours", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tc1Minutes">Minutes</Label>
                    <Input
                      id="tc1Minutes"
                      value={timecode1.minutes}
                      onChange={(e) => handleTimecodeInputChange(1, "minutes", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tc1Seconds">Seconds</Label>
                    <Input
                      id="tc1Seconds"
                      value={timecode1.seconds}
                      onChange={(e) => handleTimecodeInputChange(1, "seconds", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tc1Frames">Frames</Label>
                    <Input
                      id="tc1Frames"
                      value={timecode1.frames}
                      onChange={(e) => handleTimecodeInputChange(1, "frames", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant={operation === "add" ? "default" : "outline"}
                  onClick={() => setOperation("add")}
                  className="w-12 h-12"
                >
                  <PlusIcon className="h-6 w-6" />
                </Button>
                <Button
                  variant={operation === "subtract" ? "default" : "outline"}
                  onClick={() => setOperation("subtract")}
                  className="w-12 h-12"
                >
                  <MinusIcon className="h-6 w-6" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <Label>Second Timecode</Label>
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="tc2Hours">Hours</Label>
                    <Input
                      id="tc2Hours"
                      value={timecode2.hours}
                      onChange={(e) => handleTimecodeInputChange(2, "hours", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tc2Minutes">Minutes</Label>
                    <Input
                      id="tc2Minutes"
                      value={timecode2.minutes}
                      onChange={(e) => handleTimecodeInputChange(2, "minutes", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tc2Seconds">Seconds</Label>
                    <Input
                      id="tc2Seconds"
                      value={timecode2.seconds}
                      onChange={(e) => handleTimecodeInputChange(2, "seconds", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tc2Frames">Frames</Label>
                    <Input
                      id="tc2Frames"
                      value={timecode2.frames}
                      onChange={(e) => handleTimecodeInputChange(2, "frames", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Result</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(`${resultTimecode.hours}:${resultTimecode.minutes}:${resultTimecode.seconds}:${resultTimecode.frames}`)}
                          >
                            {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy result</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="resultHours">Hours</Label>
                      <Input
                        id="resultHours"
                        value={resultTimecode.hours}
                        readOnly
                        className="font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resultMinutes">Minutes</Label>
                      <Input
                        id="resultMinutes"
                        value={resultTimecode.minutes}
                        readOnly
                        className="font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resultSeconds">Seconds</Label>
                      <Input
                        id="resultSeconds"
                        value={resultTimecode.seconds}
                        readOnly
                        className="font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resultFrames">Frames</Label>
                      <Input
                        id="resultFrames"
                        value={resultTimecode.frames}
                        readOnly
                        className="font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Understanding Timecode</CardTitle>
              <CardDescription>
                Learn about timecode formats and their applications in video editing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">What is Timecode?</h3>
                <p>
                  Timecode is a sequence of numeric codes generated at regular intervals by a timing system. 
                  In video production, timecode is used to identify specific frames with a timestamp in the format HH:MM:SS:FF 
                  (hours, minutes, seconds, frames).
                </p>
                
                <h3 className="text-lg font-semibold">Types of Timecode</h3>
                <div className="space-y-3">
                  <div className="rounded-md border p-4">
                    <div className="font-medium">Non-Drop Frame (NDF)</div>
                    <p className="text-sm text-muted-foreground">
                      A continuous count of frames without any skipped numbers. Used with 24fps, 25fps, 30fps, 50fps, and 60fps.
                      Displayed with colons (HH:MM:SS:FF).
                    </p>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <div className="font-medium">Drop Frame (DF)</div>
                    <p className="text-sm text-muted-foreground">
                      Compensates for the NTSC frame rate of 29.97fps (instead of 30fps) by skipping specific frame numbers.
                      Displayed with semicolons (HH:MM:SS;FF). Used with 29.97fps and 59.94fps.
                    </p>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold">Common Frame Rates & Timecode</h3>
                <div className="space-y-3">
                  <div className="rounded-md border p-4">
                    <div className="font-medium">23.976 fps</div>
                    <p className="text-sm text-muted-foreground">
                      Used for film-to-digital conversion. One second of timecode contains 23.976 frames.
                    </p>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <div className="font-medium">24 fps</div>
                    <p className="text-sm text-muted-foreground">
                      The standard for cinema. One second of timecode contains 24 frames.
                    </p>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <div className="font-medium">25 fps</div>
                    <p className="text-sm text-muted-foreground">
                      The PAL standard used in Europe and many other countries. One second of timecode contains 25 frames.
                    </p>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <div className="font-medium">29.97 fps (Drop Frame)</div>
                    <p className="text-sm text-muted-foreground">
                      The NTSC standard used in North America and Japan. Uses drop frame timecode to maintain synchronization with real time.
                    </p>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold">Timecode Applications</h3>
                <div className="rounded-md border p-4 bg-muted/50">
                  <h4 className="font-medium">Common Uses</h4>
                  <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                    <li>Synchronizing audio and video</li>
                    <li>Logging and organizing footage</li>
                    <li>Creating edit decision lists (EDLs)</li>
                    <li>Communicating specific points in a timeline</li>
                    <li>Calculating durations for scenes or entire projects</li>
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