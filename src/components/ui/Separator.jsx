import React from 'react'
export function Separator({ className='' }){
  return <hr className={['border-none h-px bg-white/10', className].join(' ')} />
}
