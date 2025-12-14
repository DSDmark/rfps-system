import { NextPage } from "next"
import { AppProps } from "next/app"
import { ReactNode } from "react"

export type NextPageWithLayout = NextPage & {
  getLayout: () => ReactNode
}

export type AppPropsWithLayout = AppProps & {
  component: NextPageWithLayout
}

export type Slug = string | string[] | undefined
