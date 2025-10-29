import Link from "next/link";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { ContactForm } from "./contact-form";
import { createClient } from "@/lib/supabase/server";

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const supabase = await createClient();
  
  const { data: contactContent } = await supabase
    .from("site_content")
    .select("*")
    .eq("section_name", "contact")
    .single();

  const email = contactContent?.content?.email || "contact@blessings.com";
  const description = contactContent?.content?.description || "Feel free to reach out through any of these channels. I'm always open to discussing new opportunities.";
  const social = contactContent?.content?.social || [];

  return (
    <footer id="contact" className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Contact Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Contact</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
          <p className="text-xl text-muted-foreground mt-6 max-w-2xl mx-auto">
            Get in touch with me for collaboration, questions, or just to say hello!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Connect Info - Left Side */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Let&apos;s Connect</h3>
              <p className="text-muted-foreground mb-6">
                {description}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                  Email
                </h4>
                <a href={`mailto:${email}`} className="flex items-center gap-3 text-lg hover:text-primary transition-colors group">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Mail size={20} />
                  </div>
                  <span>{email}</span>
                </a>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                  Social Media
                </h4>
                <div className="flex gap-3">
                  {social.map((platform: any, index: number) => {
                    const socialIcons: Record<string, any> = {
                      Github: Github,
                      Linkedin: Linkedin,
                      Twitter: Twitter,
                    };
                    const Icon = socialIcons[platform.name] || Mail;
                    return (
                      <a key={index} href={platform.url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg border border-border hover:bg-accent transition-all hover:scale-105 group">
                        <Icon size={24} className="group-hover:text-primary" />
                      </a>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                  Quick Links
                </h4>
                <div className="flex flex-col gap-2">
                  <Link href="#about" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2">
                    <span>About</span>
                  </Link>
                  <Link href="#apps" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2">
                    <span>My Apps</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - Right Side */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-2">Get in Touch</h3>
              <p className="text-muted-foreground">
                Send me a message and I&apos;ll get back to you as soon as possible.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Blessings Chilemba. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

