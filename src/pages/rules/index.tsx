import React from 'react'
import RuleEvent from 'components/rules'
import DefaultLayout from 'layouts/default'
import { NextPageWithLayout } from 'types/layout.type'

const RulesPage: NextPageWithLayout = () => {
  return <RuleEvent />
}

RulesPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default RulesPage
