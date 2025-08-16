import React from 'react'
export function Badge({ children, className='' }){
  return <span className={['rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] tracking-wider text-zinc-300', className].join(' ')}>{children}</span>
}
