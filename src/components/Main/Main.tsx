import React, { useState } from 'react'

import { Field, Form, Formik, FormikHelpers } from 'formik'

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Row,
} from 'reactstrap'

import SeverityTable, {
  SeverityTableColumn,
  SeverityTableRow,
} from './SeverityTable'

import { CollapsibleCard } from './CollapsibleCard'
import LinePlot from './Plot'
import AgePlot from './PlotAgeAndParams'
import PopTable from './PopAvgRates'

import run from '../../algorithms/run'

import {
  AdditionalParams,
  AllParams,
  MainParams,
  Month,
} from '../../algorithms/Param.types'

import countryAgeDistribution from '../../assets/data/country_age_distribution.json'
import { CountryAgeDistribution } from '../../assets/data/CountryAgeDistribution.types'
import { AlgorithmResult } from '../../algorithms/Result.types'

const mainParams: MainParams = {
  populationServed: { name: 'Population Served', defaultValue: 100_000 },
  ageDistribution: { name: 'Age Distribution', defaultValue: 'Switzerland' },
  suspectedCasesToday: { name: 'Suspected Cases Today', defaultValue: 10 },
  importsPerDay: { name: 'Imports Per Day', defaultValue: 2 },
  tMax: { name: 'Simulate until', defaultValue: "2021-03-31"}
}

const additionalParams: AdditionalParams = {
  r0: { name: 'R0', defaultValue: 2.2 },
  incubationTime: { name: 'Incubation Time [days]', defaultValue: 5 },
  infectiousPeriod: { name: 'Infectious Period [days]', defaultValue: 3 },
  lengthHospitalStay: { name: 'Length of Hospital stay [days]', defaultValue: 10 },
  seasonalForcing: { name: 'Seasonal Forcing', defaultValue: 0.2 },
  peakMonth: { name: 'Peak Month', defaultValue: Month.Jan },
}

// Reduce default values into an object { key: defaultValue }
const allDefaults = Object.entries({
  ...mainParams,
  ...additionalParams,
}).reduce((result, [key, { defaultValue }]) => {
  return { ...result, [key]: defaultValue }
}, {}) as AllParams

const columns: SeverityTableColumn[] = [
  { name: 'ageGroup', title: 'Age group' },
  { name: 'mild', title: 'Mild [% of conf.]' },
  { name: 'severe', title: 'Severe [% of conf.]' },
  { name: 'fatal', title: 'Fatal [% of conf.]' },
  { name: 'confirmed', title: 'Confirmed [% total]' },
]

const severityDefaults: SeverityTableRow[] = [
  { id: 0, ageGroup: '0-9', mild: 99, severe: 1, fatal: 0, confirmed: 100 },
  { id: 2, ageGroup: '10-19', mild: 97, severe: 2.8, fatal: 0.2, confirmed: 30 },
  { id: 4, ageGroup: '20-29', mild: 97, severe: 2.8, fatal: 0.2, confirmed: 30 },
  { id: 6, ageGroup: '30-39', mild: 97, severe: 2.8, fatal: 0.2, confirmed: 30 },
  { id: 8, ageGroup: '40-49', mild: 94, severe: 5.6, fatal: 0.4, confirmed: 40 },
  { id: 10, ageGroup: '50-59', mild: 90, severe: 8.7, fatal: 1.3, confirmed: 55 },
  { id: 12, ageGroup: '60-69', mild: 75, severe: 21.4, fatal: 3.6, confirmed: 70 },
  { id: 14, ageGroup: '70-79', mild: 50, severe: 42, fatal: 8.0, confirmed: 80 },
  { id: 16, ageGroup: '80+', mild: 30, severe: 56, fatal: 14, confirmed: 90 },
]

function Main() {
  const [severity, setSeverity] = useState<SeverityTableRow[]>(severityDefaults)
  const [result, setResult] = useState<AlgorithmResult | undefined>()

  async function handleSubmit(
    params: AllParams,
    { setSubmitting }: FormikHelpers<AllParams>,
  ) {
    const newResult = await run(params, severity, countryAgeDistribution)
    setResult(newResult)
    // console.log(JSON.stringify({ result }, null, 2))
    setSubmitting(false)
  }

  return (
    <Row>
      <Col md={12}>
        <Formik initialValues={allDefaults} onSubmit={handleSubmit}>
          <Form className="form">
            <Card>
              <CardHeader>Main parameters</CardHeader>
              <CardBody>
                {Object.entries(mainParams).map(([key, { name }]) => (
                  <FormGroup key={key}>
                    <label htmlFor={key}>{name}</label>
                    <Field className="form-control" id={key} name={key} />
                  </FormGroup>
                ))}
              </CardBody>
            </Card>

            <CollapsibleCard title="Additional parameters">
              {Object.entries(additionalParams).map(([key, { name }]) => (
                <FormGroup key={key}>
                  <label htmlFor={key}>{name}</label>
                  <Field className="form-control" id={key} name={key} />
                </FormGroup>
              ))}
            </CollapsibleCard>

            <CollapsibleCard title="Severity">
              <SeverityTable
                columns={columns}
                rows={severity}
                setRows={setSeverity}
              />
            </CollapsibleCard>

            <FormGroup>
              <Button type="submit" color="primary">
                Run
              </Button>
            </FormGroup>

            <Card>
              <CardHeader>Results</CardHeader>
              <CardBody>
                <Row>
                  <Col>
                    <LinePlot data={result} />
                  </Col>
                  <Col>
                    <PopTable result={result} rates={severity}/>
                  </Col>
                  <Col>
                    <AgePlot data={result} rates={severity} />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Form>
        </Formik>
      </Col>
    </Row>
  )
}

export default Main
