import StorageCalculator from "@/components/tools/storage-calculator"

export const metadata = {
  title: "Storage Calculator | Video Editor's Toolkit",
  description: "Estimate storage requirements based on resolution, codec, and duration",
}

export default function StoragePage() {
  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Storage Calculator</h1>
        <p className="text-lg text-muted-foreground">
          Estimate storage requirements for different video formats and calculate how much footage can fit on your
          drives.
        </p>
      </div>

      <StorageCalculator />
    </div>
  )
}

