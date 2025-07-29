import Link from "next/link"
import { ArrowRight, RatioIcon as AspectRatio, HardDrive, Settings, FileVideo, Clock, Palette, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const tools = [
  {
    title: "Aspect Ratio Calculator",
    description: "Calculate new dimensions while maintaining pixel count for different aspect ratios",
    icon: <AspectRatio className="h-12 w-12 text-primary" />,
    href: "/tools/aspect-ratio",
  },
  {
    title: "Export Settings Optimizer",
    description: "Get recommended export settings based on platform, content type, and quality needs",
    icon: <Settings className="h-12 w-12 text-primary" />,
    href: "/tools/export-settings",
  },
  {
    title: "Storage Calculator",
    description: "Estimate storage requirements based on resolution, codec, and duration",
    icon: <HardDrive className="h-12 w-12 text-primary" />,
    href: "/tools/storage",
  },
  {
    title: "Frame Rate Calculator",
    description: "Calculate optimal shutter speed for different frame rates to achieve desired motion blur",
    icon: <Clock className="h-12 w-12 text-primary" />,
    href: "/tools/frame-rate",
  },
  {
    title: "Color Space Converter",
    description: "Convert between color spaces like Rec.709, Rec.2020, and DCI-P3 for accurate color reproduction",
    icon: <Palette className="h-12 w-12 text-primary" />,
    href: "/tools/color-space",
  },
  {
    title: "Timecode Calculator",
    description: "Convert between frames, timecode, and real-time for different frame rates and perform timecode math",
    icon: <Timer className="h-12 w-12 text-primary" />,
    href: "/tools/timecode",
  },
  {
    title: "Shot List Generator",
    description: "Create professional shot lists with time estimates and storyboard layouts",
    icon: <FileVideo className="h-12 w-12 text-primary" />,
    href: "/tools/shot-list",
  },
]

export default function Home() {
  return (
    <div className="container py-12 space-y-16">
      {/* Hero section */}
      <section className="flex flex-col items-center text-center space-y-6 py-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Professional Tools for Video Editors
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Streamline your workflow with our suite of interactive calculators and tools designed specifically for video
          editors.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/tools/aspect-ratio">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Tools section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter">Featured Tools</h2>
          <p className="text-muted-foreground">
            Interactive calculators and generators to optimize your video editing workflow
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <Link key={tool.title} href={tool.href} className="group">
              <Card className="h-full tool-card">
                <CardHeader className="pb-2">
                  <div className="mb-2">{tool.icon}</div>
                  <CardTitle>{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="min-h-[60px]">{tool.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="group-hover:translate-x-1 transition-transform">
                    Try it <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter">Why Use Our Toolkit?</h2>
          <p className="text-muted-foreground">Designed by editors, for editors</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Instant Calculations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All calculations happen client-side for immediate results without waiting for server responses.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Visual Representations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                See visual previews of aspect ratios, storage comparisons, and other key metrics.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Export & Share</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Export your results as PDFs, copy to clipboard, or save for future reference.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

