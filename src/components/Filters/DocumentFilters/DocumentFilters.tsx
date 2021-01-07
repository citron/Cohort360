import React from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

import InputDate from 'components/Inputs/InputDate/InputDate'

import { docTypes } from '../../../assets/docTypes.json'

import useStyles from './styles'

type DocumentFiltersProps = {
  open: boolean
  onClose: () => void
  onSubmit: () => void
  nda: string
  onChangeNda: (nda: string) => void
  selectedDocTypes: string[]
  onChangeSelectedDocTypes: (selectedDocTypes: string[]) => void
  startDate?: string
  onChangeStartDate: (startDate: string | undefined) => void
  endDate?: string
  onChangeEndDate: (endDate: string | undefined) => void
  deidentified: boolean
}
const DocumentFilters: React.FC<DocumentFiltersProps> = ({
  open,
  onClose,
  onSubmit,
  nda,
  onChangeNda,
  selectedDocTypes,
  onChangeSelectedDocTypes,
  startDate,
  onChangeStartDate,
  endDate,
  onChangeEndDate,
  deidentified
}) => {
  const classes = useStyles()

  const docTypesList = docTypes

  const _onChangeSelectedDocTypes = (
    event: React.ChangeEvent<{}>,
    value: {
      type: string
      label: string
      code: string
    }[]
  ) => {
    if (value) onChangeSelectedDocTypes(value.map((value) => value.code))
  }

  const _onChangeNda = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeNda(event.target.value)
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className={classes.title}>Filtrer par :</DialogTitle>
      <DialogContent className={classes.dialog}>
        <Grid container direction="column" className={classes.filter}>
          <Typography variant="h3">Type de documents :</Typography>
          <Autocomplete
            multiple
            onChange={_onChangeSelectedDocTypes}
            groupBy={(doctype) => doctype.type}
            options={docTypesList}
            value={docTypesList.filter((value) => selectedDocTypes.includes(value.code))}
            disableCloseOnSelect
            getOptionLabel={(docType: any) => docType.label}
            renderOption={(docType: any) => <React.Fragment>{docType.label}</React.Fragment>}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Types de documents" placeholder="Types de documents" />
            )}
            className={classes.autocomplete}
          />
        </Grid>
        {!deidentified && (
          <Grid container direction="column" className={classes.filter}>
            <Typography variant="h3">NDA :</Typography>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="NDA"
              autoFocus
              placeholder="Exemple: 6601289264,141740347"
              value={nda}
              onChange={_onChangeNda}
            />
          </Grid>
        )}
        <Grid container direction="column" className={classes.filter}>
          <Typography variant="h3">Date :</Typography>
          <InputDate
            label={'Après le :'}
            value={startDate}
            onChange={(startDate: string) => onChangeStartDate(startDate)}
          />
          <InputDate label={'Avant le :'} value={endDate} onChange={(endDate: string) => onChangeEndDate(endDate)} />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annuler
        </Button>
        <Button onClick={onSubmit} color="primary">
          Valider
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DocumentFilters
