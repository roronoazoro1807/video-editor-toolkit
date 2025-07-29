import { Metadata } from "next";
import { ColorSpaceConverter } from "@/components/tools/color-space-converter";

export const metadata: Metadata = {
  title: "Color Space Converter | Video Editor's Toolkit",
  description: "Convert between different color spaces like Rec.709, Rec.2020, DCI-P3, and more for accurate color reproduction across different displays and platforms.",
};

export default function ColorSpacePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Color Space Converter</h1>
      <p className="text-muted-foreground mb-8">
        Convert between different color spaces like Rec.709, Rec.2020, DCI-P3, and more for accurate color reproduction across different displays and platforms.
        This tool helps ensure your colors look consistent regardless of where your content is viewed.
      </p>
      <ColorSpaceConverter />
    </div>
  );
} 