import ContactForm from "@/components/contact-form"

export const metadata = {
  title: "Contact | Video Editor's Toolkit",
  description: "Get in touch with the Video Editor's Toolkit team",
}

export default function ContactPage() {
  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Contact Us</h1>
        <p className="text-lg text-muted-foreground">
          Have questions, feedback, or suggestions? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tighter">Get in Touch</h2>
            <p className="text-muted-foreground mt-2">
              We welcome your feedback and are here to help with any questions you might have about our toolkit.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Feature Requests</h3>
            <p className="text-sm text-muted-foreground">
              Have an idea for a new tool or feature? Let us know! We&apos;re always looking to improve and expand our
              toolkit.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Bug Reports</h3>
            <p className="text-sm text-muted-foreground">
              Found a bug? Please let us know so we can fix it as soon as possible.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">General Inquiries</h3>
            <p className="text-sm text-muted-foreground">
              For any other questions or comments, feel free to reach out.
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  )
}

