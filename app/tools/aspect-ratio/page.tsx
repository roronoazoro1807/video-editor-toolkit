import AspectRatioCalculator from "@/components/tools/aspect-ratio-calculator"

export const metadata = {
  title: "Aspect Ratio Calculator | Video Editor's Toolkit",
  description: "Calculate new dimensions while maintaining pixel count for different aspect ratios",
}

export default function AspectRatioPage() {
  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Aspect Ratio Calculator</h1>
        <p className="text-lg text-muted-foreground">
          Calculate new dimensions for different aspect ratios while maintaining pixel count. Visualize how your frame
          will be cropped or padded.
        </p>
      </div>

      <AspectRatioCalculator />
    </div>
  )
}

