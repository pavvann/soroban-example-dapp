import React from 'react'
import { useAccount, useIsMounted} from '../../../hooks'
import { ConnectButton } from '../../atoms'
import styles from './style.module.css'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next'

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['home'])),
    },
  };

}

// TODO: Eliminate flash of unconnected content on loading
export function WalletData() {
  const mounted = useIsMounted()
  const account = useAccount()
  const {t} = useTranslation();


  return (
    <>
      {mounted && account ? (
        <div className={styles.displayData}>
          <div className={styles.card}>{account.displayName}</div>
        </div>
      ) : (
        <ConnectButton label={t("home:connect")} />
      )}
    </>
  )
}
