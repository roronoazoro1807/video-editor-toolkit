import { Metadata } from "next";
import { FrameRateCalculator } from "../../../components/tools/frame-rate-calculator";

export const metadata: Metadata = {
  title: "Frame Rate vs. Shutter Speed Calculator | Video Editor's Toolkit",
  description: "Calculate the optimal shutter speed for different frame rates to achieve the desired motion blur effect in your videos.",
};

export default function FrameRatePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Frame Rate vs. Shutter Speed Calculator</h1>
      <p className="text-muted-foreground mb-8">
        Calculate the optimal shutter speed for different frame rates to achieve the desired motion blur effect in your videos.
        This tool helps you apply the 180-degree shutter rule and other creative options.
      </p>
      <FrameRateCalculator />
    </div>
  );
} 