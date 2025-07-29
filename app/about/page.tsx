export const metadata = {
  title: "About | Video Editor's Toolkit",
  description: "Learn about the Video Editor's Toolkit and its purpose",
}

export default function AboutPage() {
  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          About Video Editor&apos;s Toolkit
        </h1>
        <p className="text-lg text-muted-foreground">
          Professional tools designed to streamline your video editing workflow
        </p>
      </div>

      <div className="space-y-6 max-w-3xl">
        <p>
          Video Editor&apos;s Toolkit was created to solve common challenges faced by video editors, filmmakers, and
          content creators. Our goal is to provide intuitive, powerful tools that help you work more efficiently and
          make better creative decisions.
        </p>

        <h2 className="text-2xl font-bold tracking-tighter">Our Mission</h2>
        <p>
          We believe that technical calculations and format conversions shouldn&apos;t get in the way of your creative
          process. Our toolkit aims to handle the technical details so you can focus on what matters most - telling
          compelling stories through video.
        </p>

        <h2 className="text-2xl font-bold tracking-tighter">The Tools</h2>
        <p>
          Each tool in our collection has been carefully designed to address specific needs in the video production
          workflow:
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Aspect Ratio Calculator:</strong> Quickly determine the optimal dimensions when converting between
            different aspect ratios, with visual previews of how your content will be affected.
          </li>
          <li>
            <strong>Export Settings Optimizer:</strong> Get platform-specific recommendations for codecs, bitrates, and
            other export settings to ensure your videos look their best on any platform.
          </li>
          <li>
            <strong>Storage Calculator:</strong> Plan your storage needs by calculating file sizes for different formats
            and resolutions, helping you make informed decisions about media management.
          </li>
          <li>
            <strong>Shot List Generator:</strong> Create professional shot lists with time estimates, equipment needs,
            and storyboard layouts to keep your productions organized and efficient.
          </li>
        </ul>

        <h2 className="text-2xl font-bold tracking-tighter">Built By Editors, For Editors</h2>
        <p>
          Our team consists of experienced video professionals who understand the challenges of modern video production.
          We&apos;ve created the tools we wished we had, and we&apos;re constantly improving them based on feedback from
          our community.
        </p>

        <h2 className="text-2xl font-bold tracking-tighter">Open Source</h2>
        <p>
          Video Editor&apos;s Toolkit is an open-source project. We believe in the power of community collaboration to
          create better tools for everyone. Contributions, suggestions, and feedback are always welcome.
        </p>
      </div>
    </div>
  )
}

