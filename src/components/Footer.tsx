import Link from "next/link";
import { Github, Linkedin, Mail, Phone } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/bwithnomi",
    },
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/bwithnomi",
    },
    {
      name: "Email",
      icon: Mail,
      href: "mailto:abidnoman888@gmail.com",
    },
    {
      name: "Phone",
      icon: Phone,
      href: "tel:+923325671932",
    },
  ];

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 mt-16 sm:mt-20 py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  aria-label={social.name}
                >
                  <Icon size={24} className="hover:scale-110 transition-transform" />
                </Link>
              );
            })}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} CodeHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

