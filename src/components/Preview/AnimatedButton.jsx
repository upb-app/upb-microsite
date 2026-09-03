import React from 'react';
import DynamicIcon from '../Common/DynamicIcon';
import { ExternalLink, ChevronRight } from 'lucide-react';

export default function AnimatedButton({ 
  link = {}, 
  buttonStyle, 
  globalButtonStyle, 
  accentColor = "#f59e0b",
  onLinkClick 
}) {
  const currentLink = link || {};
  const currentStyle = buttonStyle || globalButtonStyle || {};

  // Determine animation class
  const animationClass = currentLink.animation && currentLink.animation !== 'inherit' 
    ? currentLink.animation 
    : (currentStyle.animation || 'anim-hover-scale');

  // Determine button shape & styling
  const roundedClass = currentStyle.rounded || currentStyle.shape || 'rounded-xl';
  const variant = currentStyle.variant || 'glass';

  // Base styles based on variant or custom colors
  let styleClasses = "";
  let inlineStyles = {};

  const hasCustomColor = !!(currentLink.customBgColor || currentLink.customGradient);

  if (currentLink.customGradient) {
    inlineStyles.background = currentLink.customGradient;
    inlineStyles.color = currentLink.customTextColor || '#ffffff';
    inlineStyles.borderColor = currentLink.customBorderColor || 'rgba(255, 255, 255, 0.2)';
    styleClasses = "shadow-lg shadow-black/20 border hover:brightness-110";
  } else if (currentLink.customBgColor) {
    inlineStyles.backgroundColor = currentLink.customBgColor;
    inlineStyles.color = currentLink.customTextColor || '#ffffff';
    inlineStyles.borderColor = currentLink.customBorderColor || 'rgba(255, 255, 255, 0.2)';
    styleClasses = "shadow-md border hover:brightness-110";
  } else {
    switch (variant) {
      case 'solid':
        styleClasses = "bg-slate-800 text-white border border-slate-700/60 hover:bg-slate-700 shadow-md";
        break;
      case 'glass':
        styleClasses = "bg-slate-900/60 backdrop-blur-md text-white border border-white/10 hover:border-amber-400/40 hover:bg-slate-900/80 shadow-lg shadow-black/20";
        break;
      case 'outline':
        styleClasses = "bg-transparent text-slate-100 border-2 border-slate-600 hover:border-amber-400 hover:bg-slate-800/40";
        break;
      case 'gradient':
        styleClasses = "bg-gradient-to-r from-blue-700 to-indigo-900 text-white border border-blue-500/30 hover:from-blue-600 hover:to-indigo-800 shadow-md";
        break;
      case 'soft':
        styleClasses = "bg-white/10 text-white hover:bg-white/20 border border-transparent";
        break;
      default:
        styleClasses = "bg-slate-900/60 backdrop-blur-md text-white border border-white/10";
    }
  }

  const handleClick = (e) => {
    if (onLinkClick && currentLink.id) {
      onLinkClick(currentLink.id);
    }
  };

  const textColor = currentLink.customTextColor;
  const iconColor = currentLink.customIconColor || textColor || 'inherit';

  return (
    <a
      href={currentLink.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      style={inlineStyles}
      className={`group relative flex items-center justify-between w-full p-3.5 transition-all duration-300 ${roundedClass} ${styleClasses} ${animationClass} ${
        currentLink.highlight ? 'ring-2 ring-amber-400/80 shadow-lg shadow-amber-500/20' : ''
      }`}
    >
      {/* Glow pulse for highlight */}
      {currentLink.highlight && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
        </span>
      )}

      {/* Left Icon */}
      <div className="flex items-center gap-3.5 min-w-0 pr-2">
        <div 
          className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-2xs ${
            hasCustomColor ? 'border' : 'bg-slate-950/40 border border-white/10 text-amber-400 group-hover:bg-amber-500/20 group-hover:border-amber-400/50 group-hover:text-amber-300'
          }`}
          style={hasCustomColor ? {
            backgroundColor: currentLink.customIconBg || 'rgba(0, 0, 0, 0.25)',
            borderColor: currentLink.customIconBorder || 'rgba(255, 255, 255, 0.2)',
            color: iconColor
          } : {}}
        >
          <DynamicIcon name={currentLink.icon || 'Globe'} className="w-5 h-5" />
        </div>

        {/* Titles & Subtitle */}
        <div className="text-left min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 
              className="text-sm font-semibold tracking-tight transition line-clamp-1"
              style={textColor ? { color: textColor } : {}}
            >
              {currentLink.title || 'Judul Tautan'}
            </h4>
            {currentLink.badge && (
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm flex-shrink-0 ${
                currentLink.badgeColor || 'bg-amber-500 text-slate-950'
              }`}>
                {currentLink.badge}
              </span>
            )}
          </div>
          {currentLink.subtitle && (
            <p 
              className="text-xs transition line-clamp-1 mt-0.5 font-normal"
              style={textColor ? { color: textColor, opacity: 0.85 } : {}}
            >
              {currentLink.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Arrow / Action indicator */}
      <div 
        className="flex-shrink-0 text-slate-400 group-hover:translate-x-1 transition duration-200"
        style={textColor ? { color: textColor, opacity: 0.7 } : {}}
      >
        <ChevronRight className="w-5 h-5" />
      </div>
    </a>
  );
}
