import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import useStyles from './styles'
import Title from '../../Title'
import CircularProgress from '@material-ui/core/CircularProgress'
import services from 'services'

import displayDigit from 'utils/displayDigit'

const PatientSearchCard = () => {
  const [patientNb, setPatientNb] = useState(0)
  const [loading, setLoading] = useState(true)
  const classes = useStyles()

  useEffect(() => {
    const _fetchPatientsCount = async () => {
      if (typeof services.patients.fetchPatientsCount !== 'function') return

      setLoading(true)
      const patientNumber = await services.patients.fetchPatientsCount()
      setPatientNb(patientNumber)
      setLoading(false)
    }

    _fetchPatientsCount()
  }, [])

  return (
    <>
      <div id="patients-card-title">
        <Title>{loading ? <CircularProgress size={20} /> : displayDigit(patientNb)} patients pris en charge</Title>
      </div>
      <Divider />
      <Grid container direction="column" justifyContent="space-evenly" style={{ height: '100%', marginTop: 8 }}>
        <Button
          id="patients-research-button"
          href="/mes_patients"
          size="small"
          variant="contained"
          disableElevation
          className={classes.button}
        >
          Explorer tous les patients
        </Button>
        <Button
          id="scope-research-button"
          href="/perimetre"
          size="small"
          variant="contained"
          disableElevation
          className={classes.button}
        >
          Explorer un périmètre
        </Button>
      </Grid>
    </>
  )
}

export default PatientSearchCard
