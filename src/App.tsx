import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Capabilities } from './components/Capabilities'
import { WhyMe } from './components/WhyMe'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Experience } from './components/Experience'
import { Projects } from './components/Projects'
import { DeepDive } from './components/DeepDive'
import { GitHubRepos } from './components/GitHubRepos'
import { ProofOfWork } from './components/ProofOfWork'
import { Education } from './components/Education'
import { Achievements } from './components/Achievements'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { useReveal } from './hooks/useReveal'

export default function App() {
  useReveal()

  return (
    <>
      <Nav />
      <main id="main">
        {/*
          Order follows the recruiter's question sequence:
          who → why → who in detail → what have you built → how does it work →
          what do you know → where have you been → public evidence →
          credentials → how do I reach you.

          Projects sit ahead of Skills deliberately. Skills is the tallest
          section on the page, and burying the strongest evidence behind it put
          Projects ~15 screens down on a phone.
        */}
        <Hero />
        <Capabilities />
        <WhyMe />
        <About />
        <Projects />
        <DeepDive />
        <Skills />
        <Experience />
        <GitHubRepos />
        <ProofOfWork />
        <Education />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
