import React from 'react'
export function Input(props){
  return <input {...props} className={['w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white placeholder:text-zinc-500', props.className].join(' ')} />
}
export function Textarea(props){
  return <textarea {...props} className={['w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white placeholder:text-zinc-500', props.className].join(' ')} />
}
