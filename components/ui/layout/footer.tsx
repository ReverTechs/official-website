import Link from "next/link";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { createClient } from "@/lib/supabase/server";

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const supabase = await createClient();
  
  const { data: contactContent } = await supabase
    .from("site_content")
    .select("*")
    .eq("section_name", "contact")
    .single();

  const email = contactContent?.content?.email || "reverbc.dev@yahoo.com";
  const description = contactContent?.content?.description || "Feel free to reach out through any of these channels. I'm always open to discussing new opportunities.";
  const social = contactContent?.content?.social || [];

  return (
    <footer id="contact" className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        {/* Contact Section Title */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Contact</h2>
          <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mt-4 sm:mt-6 max-w-2xl mx-auto px-2">
            Get in touch with me for collaboration, questions, or just to say hello!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
          {/* Connect Info - Left Side */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Let&apos;s Connect</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                {description}
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <h4 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-muted-foreground uppercase tracking-wide">
                  Email
                </h4>
                <a href={`mailto:${email}`} className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg hover:text-primary transition-colors group">
                  <div className="p-2 sm:p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="break-all">{email}</span>
                </a>
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-muted-foreground uppercase tracking-wide">
                  Social Media
                </h4>
                <div className="flex gap-2 sm:gap-3">
                  {social.map((platform: any, index: number) => {
                    const socialIcons: Record<string, any> = {
                      Github: Github,
                      Linkedin: Linkedin,
                      Twitter: Twitter,
                    };
                    const Icon = socialIcons[platform.name] || Mail;
                    return (
                      <a key={index} href={platform.url} target="_blank" rel="noopener noreferrer" className="p-2 sm:p-3 rounded-lg border border-border hover:bg-accent transition-all hover:scale-105 group">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:text-primary" />
                      </a>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-muted-foreground uppercase tracking-wide">
                  Quick Links
                </h4>
                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <Link href="#about" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2">
                    <span>About</span>
                  </Link>
                  <Link href="#apps" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2">
                    <span>My Apps</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - Right Side */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 md:p-8 shadow-lg">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">Get in Touch</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Send me a message and I&apos;ll get back to you as soon as possible.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-border text-center text-xs sm:text-sm text-muted-foreground">
          <p>&copy; {currentYear} Blessings Rever Chilemba. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

