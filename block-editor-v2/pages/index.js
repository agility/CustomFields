import Head from 'next/head'
import styles from '../styles/Home.module.css'
import dynamic from 'next/dynamic'

const BlockEditor = dynamic(
  () => import('../components/BlockEditor'),
  { ssr: false }
)

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Block Editor for Agility CMS (next js)</title>
        <meta name="description" content="Block Editor for Agility CMS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
          <BlockEditor />
      </main>
    </div>
  )
}
