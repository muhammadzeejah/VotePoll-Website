import Head from 'next/head'
import { Inter } from '@next/font/google'
import HomePage from '../components/Home'
import About from '../components/About'
import LearnToVote from '../components/LearnToVote'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <>
      <Head>
        <title>Vote Poll</title>
        <meta name="description" content="Online Voting System" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <HomePage />
        <About />
        <LearnToVote />
        <Contact />
      </main>
    </>
  )
}
