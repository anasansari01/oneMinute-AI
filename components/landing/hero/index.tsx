import { ArrowRight, Send, User } from 'lucide-react'
import Image from 'next/image'

const Hero = () => {
  return (
    <section className='relative pt-32 pb-20 md:pt-48 md:pb-32  px-6 overflow-hidden'>
      <div className='max-w-4xl mx-auto text-center relative z-20'>
        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 animate-float'>
          <span className='w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]'></span>
          <span className='text-xs text-zinc-300 tracking-wide font-light'>
            version 1.0.0 available now
          </span>
        </div>
        <h1 className='text-5xl md:text-7xl font-medium tracking-tight text-white mb-6 leading-[1.1]'>
          Human-friendly support,
          <br />
          <span className='text-zinc-500'>
            powered by AI
          </span>
        </h1>
        <p className='text-lg md:text-xl text-zinc-400 font-light mb-10 mx-auto max-w-2xl leading-relaxed'>
          Instantly resolve customer question with an assistant that reads your docs and speaks with empathy. No robotic replies, just answer.
        </p>
        <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-20'>
          <button className='h-11 px-8 cursor-pointer rounded-full bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-all flex items-center gap-2'>
            Start for free
            <ArrowRight className='w-4 h-4'/>
          </button>
          <button className='h-11 px-8 rounded-full border border-zinc-800 text-zinc-300 text-sm font-medium hover:border-zinc-600 hover:text-white transition-all bg-black/20 backdrop-blur-sm'>
            View demo
          </button>
        </div>
      </div>

      {/* Floating chat interface visualization */}
      <div className='max-w-3xl mx-auto relative z-10'>
        <div className='absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none'></div>

        <div className='rounded-2xl p-1 md:p-2 relative overflow-hidden ring-1 ring-white/10 bg-[#0a0a0e] shadow-2xl'>
          <div className='flex flex-col h-125 md:h-150 w-full bg-[#0a0a0e] rounded-xl overflow-hidden'>
            <div className='h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0E0E12] shrink-0'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></div>
                  <span className='text-sm font-medium text-zinc-300'>
                    OneMinute Stack   Inc.
                  </span>
              </div>
            </div>
            <div className='flex-1 p-6 overflow-y-auto space-y-6 bg-zinc-950/30'>
              <div className='flex w-full flex-col items-start'>
                <div className='flex max-w-[85%] flex-row gap-3'>
                  <div className='w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5 overflow-hidden'>
                    <Image 
                      src="https://images.unsplash.com/photo-1606122017369-d782bbb78f32?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                      alt="Support Agent"
                      width={40}
                      height={40}
                      className='w-full h-full object-cover rounded-full'
                    />
                  </div>
                  <div className='space-y-2'>
                    <div className='p-4 rounded-2xl text-sm leading-relaxed shadow-sm bg-white text-zinc-900 rounded-tl-sm'>
                      Hi there, How can I help you?
                    </div>
                    <div className='flex flex-wrap gap-2 pt-1 ml-1'>
                      <span className='px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/5 text-zinc-300 text-xs font-medium cursor-default'>
                      FAQ
                      </span>
                      <span className='px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/5 text-zinc-300 text-xs font-medium cursor-default'>
                      Pricing
                      </span>
                      <span className='px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/5 text-zinc-300 text-xs font-medium cursor-default'>
                      Support
                      </span>
                    </div>
                  </div>
                </div>
                <div className='flex w-full flex-col items-end'>
                  <div className='flex max-w-[85%] gap-3 flex-row-reverse'>
                    <div className='w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-white/5 bg-zinc-800'>
                      <User className='w-4 h-4 text-zinc-400'/>
                    </div>
                    <div className='p-4 rounded-2xl text-sm leading-relaxed shadow-sm bg-zinc-800 text-zinc-200 rounded-tr-sm'>
                      I need some information about oneminute stack
                    </div>
                  </div>
                </div>
                <div className='flex w-full flex-col items-start mt-5'>
                  <div className='flex max-w-[85%] flex-row gap-3'>
                    <div className='w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5 overflow-hidden'>
                      <Image 
                        src="https://images.unsplash.com/photo-1606122017369-d782bbb78f32?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                        alt="Support Agent"
                        width={40}
                        height={40}
                        className='w-full h-full object-cover rounded-full'
                      />
                    </div>
                    <div className='p-4 rounded-2xl text-sm leading-relaxed shadow-sm bg-white text-zinc-900 rounded-tl-sm'>
                      OneMinute Stack is an integrated ecosystem designed to enchance developer efficiency. It includes tools like oneMinute Logs for real-time monitoring and community support.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='p-4 bg-[#0A0A0E] border-t border-white/5 shrink-0'>
              <div className='relative'>
                <div className='min-h-12.5 w-full px-4 py-4 text-sm bg-zinc-900/5 border border-white/1- rounded-xl text-zinc-500 flex items-center justify-between'>
                  <span>Type a message...</span>
                  <button className='h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 cursor-default'>
                    <Send className='w-4 h-4'/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>  
  )
}

export default Hero;