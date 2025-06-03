
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

interface SocialIconsProps {
  className?: string;
  iconSize?: number;
}

export const SocialIcons = ({ className = "", iconSize = 24 }: SocialIconsProps) => {
  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://facebook.com',
      icon: Facebook,
      color: 'hover:text-blue-600'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com',
      icon: Twitter,
      color: 'hover:text-blue-400'
    },
    {
      name: 'Instagram', 
      url: 'https://instagram.com',
      icon: Instagram,
      color: 'hover:text-pink-600'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: Linkedin,
      color: 'hover:text-blue-700'
    }
  ];

  return (
    <div className={`flex space-x-4 ${className}`}>
      {socialLinks.map((social) => {
        const IconComponent = social.icon;
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-gray-400 ${social.color} transition-colors duration-200`}
            aria-label={`Follow us on ${social.name}`}
          >
            <IconComponent size={iconSize} />
          </a>
        );
      })}
    </div>
  );
};
