import Features from '@/components/landing/features'
import Footer from '@/components/landing/footer'
import Hero from '@/components/landing/hero'
import Integration from '@/components/landing/integration'
import NavBar from '@/components/landing/nav'
import Pricing from '@/components/landing/pricing'
import SocialProof from '@/components/landing/social'

const Page = () => {
  return (
    <main className='w-full flex flex-col relative z-10'>
      <NavBar/>
      <Hero/>
      <SocialProof/>
      <Features/>
      <Integration/>
      <Pricing/>
      <Footer/>
    </main>
  )
}

export default Page