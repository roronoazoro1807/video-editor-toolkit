import ExportSettingsOptimizer from "@/components/tools/export-settings-optimizer"

export const metadata = {
  title: "Export Settings Optimizer | Video Editor's Toolkit",
  description: "Get recommended export settings based on platform, content type, and quality needs",
}

export default function ExportSettingsPage() {
  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Export Settings Optimizer</h1>
        <p className="text-lg text-muted-foreground">
          Get recommended codec, bitrate, resolution, and audio settings based on your destination platform and content
          type.
        </p>
      </div>

      <ExportSettingsOptimizer />
    </div>
  )
}

