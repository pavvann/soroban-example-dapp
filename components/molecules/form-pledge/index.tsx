import React, { FunctionComponent, useState } from 'react'
import { AmountInput, Button, Checkbox } from '../../atoms'
import { TransactionModal } from '../../molecules/transaction-modal'
import { Utils } from '../../../shared/utils'
import styles from './style.module.css'
import { Spacer } from '../../atoms/spacer'
import { abundance, crowdfund } from '../../../shared/contracts'
import { signTransaction } from '@stellar/freighter-api'
import { BASE_FEE, xdr } from '@stellar/stellar-sdk'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next'

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };

}


export interface IFormPledgeProps {
  account: string
  decimals: number
  symbol?: string
  onPledge: () => void
  updatedAt: number
}

export interface IResultSubmit {
  status: string
  value?: string
  symbol?: string
  error?: string
}

/**
 * Mint 100.0000000 tokens to the user's wallet for testing
 */
function MintButton({
  account,
  symbol,
  onComplete,
  decimals,
}: {
  decimals: number
  account: string
  symbol: string
  onComplete: () => void
}) {
  const [isSubmitting, setSubmitting] = useState(false)

  const displayAmount = 100
  const amount = BigInt(displayAmount * 10 ** decimals)
  const {t} = useTranslation();
  return (
    <Button
      title={`${t("home:mint")} ${displayAmount} ${symbol}`}
      onClick={async () => {
        setSubmitting(true)
        const tx = await abundance.mint({ to: account, amount: amount })
        await tx.signAndSend()
        setSubmitting(false)
        onComplete()
      }}
      disabled={isSubmitting}
      isLoading={isSubmitting}
    />
  )
}

const FormPledge: FunctionComponent<IFormPledgeProps> = props => {
  const [balance, setBalance] = React.useState<BigInt>(BigInt(0))
  const [decimals, setDecimals] = React.useState<number>(0)
  const [symbol, setSymbol] = React.useState<string>()

  const [amount, setAmount] = useState<number>()
  const [resultSubmit, setResultSubmit] = useState<IResultSubmit | undefined>()
  const [input, setInput] = useState('')
  const [isSubmitting, setSubmitting] = useState(false)

  React.useEffect(() => {
    Promise.all([
      abundance.balance({ id: props.account }),
      abundance.decimals(),
      abundance.symbol(),
    ]).then(fetched => {
      setBalance(fetched[0].result)
      setDecimals(fetched[1].result)
      setSymbol(fetched[2].result.toString())
    })
  }, [props.account, props.updatedAt])

  const clearInput = (): void => {
    setInput('')
  }

  const handleSubmit = async (): Promise<void> => {
    if (!amount) return

    setSubmitting(true)

    try {
      const tx = await crowdfund.deposit({
        user: props.account,
        amount: BigInt(amount * 10 ** decimals),
      })
      await tx.signAndSend()

      setResultSubmit({
        status: 'success',
        value: String(amount),
        symbol,
      })
      props.onPledge()
      setInput('')
      setAmount(undefined)
    } catch (e) {
      if (e instanceof Error) {
        setResultSubmit({
          status: 'error',
          error: e?.message || 'An error has occurred',
        })
      } else {
        throw e
      }
    } finally {
      setSubmitting(false)
    }
  }

  const {t} = useTranslation();


  return (
    <div>
      <h6>{t("home:chooseamt")}</h6>
      <div className={styles.wrapper}>
        <Checkbox
          title={`100 ${props.symbol}`}
          value={100}
          isChecked={amount == 100}
          setAmount={setAmount}
          clearInput={clearInput}
        />
        <Checkbox
          title={`250 ${props.symbol}`}
          value={250}
          isChecked={amount == 250}
          setAmount={setAmount}
          clearInput={clearInput}
        />
        <Checkbox
          title={`500 ${props.symbol}`}
          value={500}
          isChecked={amount == 500}
          setAmount={setAmount}
          clearInput={clearInput}
        />
        <Checkbox
          title={`1000 ${props.symbol}`}
          value={1000}
          isChecked={amount == 1000}
          setAmount={setAmount}
          clearInput={clearInput}
        />
      </div>
      <div className={styles.centerContent}>
        <h6>OR</h6>
      </div>
      <AmountInput
        placeHolder={t("home:customamt")}
        setAmount={setAmount}
        input={input}
        setInput={setInput}
      />
      <Button
        title={t("home:backproject")}
        onClick={handleSubmit}
        disabled={!amount || isSubmitting}
        isLoading={isSubmitting}
      />
      {props.account && props.decimals && props.symbol ? (
        <div>
          <Spacer rem={1} />
          <MintButton
            account={props.account}
            symbol={props.symbol}
            decimals={decimals}
            onComplete={() => props.onPledge()}
          />
          <div className={styles.wrapper}>
            <div>
              <h6>
                {t("home:balance")} {Utils.formatAmount(balance, decimals)} {symbol}
              </h6>
            </div>
          </div>
        </div>
      ) : null}
      {resultSubmit && (
        <TransactionModal
          result={resultSubmit}
          closeModal={() => setResultSubmit(undefined)}
        />
      )}
    </div>
  )
}

export { FormPledge }
