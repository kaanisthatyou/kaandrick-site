import React from 'react'
export function Button({ className = '', variant = 'primary', size='md', asChild, children, ...props }){
  const base = 'inline-flex items-center justify-center rounded-lg font-medium transition'
  const sizes = { sm:'px-3 py-1.5 text-sm', md:'px-4 py-2', lg:'px-5 py-3 text-lg', icon:'p-2' }
  const variants = {
    primary: 'bg-white text-black hover:bg-zinc-200',
    secondary: 'border border-white/20 bg-transparent text-white hover:bg-white/10'
  }
  const cls = [base, sizes[size]||sizes.md, variants[variant]||variants.primary, className].join(' ')
  return <button className={cls} {...props}>{children}</button>
}
