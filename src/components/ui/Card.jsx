import React from 'react'
export function Card({ className='', children }){
  return <div className={['rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur', className].join(' ')}>{children}</div>
}
export function CardHeader({ children, className='' }){
  return <div className={['px-6 pt-6', className].join(' ')}>{children}</div>
}
export function CardContent({ children, className='' }){
  return <div className={['px-6 pb-6', className].join(' ')}>{children}</div>
}
export function CardTitle({ children, className='' }){
  return <h3 className={['text-xl font-semibold', className].join(' ')}>{children}</h3>
}
