import { Metadata } from "next";
import { TimecodeCalculator } from "@/components/tools/timecode-calculator";

export const metadata: Metadata = {
  title: "Timecode Calculator | Video Editor's Toolkit",
  description: "Convert between frames, timecode, and real-time for different frame rates. Calculate durations, offsets, and more for professional video editing.",
};

export default function TimecodePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Timecode Calculator</h1>
      <p className="text-muted-foreground mb-8">
        Convert between frames, timecode, and real-time for different frame rates. Calculate durations, offsets, and more for professional video editing.
        This tool helps you work with industry-standard timecode formats across different projects.
      </p>
      <TimecodeCalculator />
    </div>
  );
} 