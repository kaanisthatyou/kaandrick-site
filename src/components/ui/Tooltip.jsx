import React from 'react'
// Minimal no-js tooltip fallback via title attribute
export function Tooltip({ children }){ return children }
export function TooltipProvider({ children }){ return children }
export function TooltipTrigger({ asChild, children, title }){ 
  if(asChild) return React.cloneElement(children, { title })
  return <span title={title}>{children}</span>
}
export function TooltipContent({ children }){ return <span className="sr-only">{children}</span> }
