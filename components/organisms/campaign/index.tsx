'use client'

import React from 'react'
import styles from './style.module.css'
import Image from 'next/image'
import picture from '../../../assets/example.png'
import { AuthorInfo } from '../../atoms'
import avatar from '../../../assets/avatar.png'
import { useEffect } from 'react';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next'

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };

}

export function Campaign(props: any) {

  const {t} = useTranslation();


  return (
    <div className={styles.content}>
      <h6>{t("home:name")}</h6>
      <h1>{t("home:proj")}</h1>
      <AuthorInfo author={t("home:author")} dateTime={t("home:time")} image={avatar} />
      <Image src={picture} width={642} height={294} alt="project image" />
      <p>
        {t("home:info")}
      </p>
      <p>{t("home:hope")}</p>
    </div>
  )
}
