import React, { ReactNode } from 'react'
import styles from './style.module.css'
import Image, { StaticImageData } from 'next/image'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next'

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['home'])),
    },
  };

}


export interface AuthorInfoProps {
  image: StaticImageData
  author: string
  dateTime: string
}

export function AuthorInfo({ image, author, dateTime }: AuthorInfoProps) {
  const {t} = useTranslation();
  return (
    <div className={styles.content}>
      <Image src={image} width={36} height={36} alt="avatar" />
      <div className={styles.author}>
        <span>{dateTime}</span>
        <br />
        <span>
          {t("home:by")} <b>{author}</b>
        </span>
      </div>
    </div>
  )
}
