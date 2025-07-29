import ShotListGenerator from "@/components/tools/shot-list-generator"

export const metadata = {
  title: "Shot List Generator | Video Editor's Toolkit",
  description: "Create professional shot lists with time estimates and storyboard layouts",
}

export default function ShotListPage() {
  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Shot List Generator</h1>
        <p className="text-lg text-muted-foreground">
          Create professional shot lists with time estimates and storyboard layouts for your video projects.
        </p>
      </div>

      <ShotListGenerator />
    </div>
  )
}

