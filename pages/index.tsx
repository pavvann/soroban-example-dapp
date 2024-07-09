import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Campaign, Pledge } from '../components/organisms'
import { WalletData } from '../components/molecules'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router';

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['home'])),
    },
  };
}

const Home: NextPage = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const changeLocale = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locale = e.target.value;
    router.push('/', '/', { locale });
  }

  return (
    <>
      <Head>
        <title>
          Crowdfund Template - An example of how to run a crowdfund campaign on Soroban.
        </title>
        <meta
          name="description"
          content="An example of loading information from a stellar smart contract"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h3>Starfund</h3>
        <div className={styles.localeSwitcher}>
          <select onChange={changeLocale} defaultValue={router.locale}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
        <WalletData />

      </header>
      <main className={styles.main}>
        <div className={styles.content}>
          <Campaign />
          <Pledge />
        </div>
      </main>
    </>
  )
}

export default Home
