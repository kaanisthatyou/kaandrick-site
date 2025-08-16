import React, { createContext, useContext, useState } from 'react'
const TabsCtx = createContext()
export function Tabs({ defaultValue, children, className='' }){
  const [value,setValue]=useState(defaultValue)
  return <TabsCtx.Provider value={{value,setValue}}><div className={className}>{children}</div></TabsCtx.Provider>
}
export function TabsList({ children, className='' }){
  return <div className={['inline-grid gap-2 rounded-xl border border-white/10 p-1', className].join(' ')}>{children}</div>
}
export function TabsTrigger({ value, children }){
  const {value:val,setValue}=useContext(TabsCtx)
  const active = val===value
  return <button onClick={()=>setValue(value)} className={'px-3 py-1.5 rounded-lg text-sm '+(active?'bg-white text-black':'text-zinc-300 hover:bg-white/10')}>{children}</button>
}
export function TabsContent({ value, children, className='' }){
  const {value:val}=useContext(TabsCtx)
  if(val!==value) return null
  return <div className={className}>{children}</div>
}
