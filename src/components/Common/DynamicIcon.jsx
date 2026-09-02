import React from 'react';
import * as LucideIcons from 'lucide-react';

export default function DynamicIcon({ name, className = "w-5 h-5", size, ...props }) {
  const IconComponent = LucideIcons[name] || LucideIcons.Globe;
  return <IconComponent className={className} size={size} {...props} />;
}
