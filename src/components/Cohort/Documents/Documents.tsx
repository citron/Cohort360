import React, { useState, useEffect } from 'react'

import {
  Button,
  CssBaseline,
  FormControlLabel,
  Grid,
  IconButton,
  InputBase,
  // Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'

import DocumentFilters from '../../Filters/DocumentFilters/DocumentFilters'
import DocumentList from './DocumentList/DocumentList'
// import WordCloud from '../Preview/Charts/WordCloud'
import DocumentSearchHelp from '../../DocumentSearchHelp/DocumentSearchHelp'
import { fetchDocuments } from '../../../services/cohortInfos'

import InfoIcon from '@material-ui/icons/Info'
import { ReactComponent as SearchIcon } from '../../../assets/icones/search.svg'
import { ReactComponent as FilterList } from '../../../assets/icones/filter.svg'

import { CohortComposition } from 'types'
import {
  // IExtension,
  IDocumentReference
} from '@ahryman40k/ts-fhir-types/lib/R4'

import useStyles from './styles'
import { useAppSelector } from 'state'
import { Autocomplete } from '@material-ui/lab'

type DocumentsProps = {
  groupId?: string
  deidentifiedBoolean: boolean
  sortBy: string
  sortDirection: 'asc' | 'desc'
}

const Documents: React.FC<DocumentsProps> = ({ groupId, deidentifiedBoolean, sortBy, sortDirection }) => {
  const classes = useStyles()
  const encounters = useAppSelector((state) => state.exploredCohort.encounters)
  const [page, setPage] = useState(1)
  const [documentsNumber, setDocumentsNumber] = useState<number | undefined>(0)
  const [allDocumentsNumber, setAllDocumentsNumber] = useState<number | undefined>(0)
  const [documents, setDocuments] = useState<(CohortComposition | IDocumentReference)[]>([])
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [searchMode, setSearchMode] = useState(false)
  // const [wordcloudData, setWordcloudData] = useState<IExtension[] | undefined>()
  const [open, setOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [nda, setNda] = useState('')
  const [selectedDocTypes, setSelectedDocTypes] = useState(['all'])
  const [startDate, setStartDate] = useState<string | undefined>(undefined)
  const [endDate, setEndDate] = useState<string | undefined>(undefined)
  const [_sortBy, setSortBy] = useState(sortBy)
  const [_sortDirection, setSortDirection] = useState(sortDirection)

  const documentLines = 20

  const sortByNames = [
    { label: 'Date', code: 'date' },
    { label: 'Type de document', code: 'type' }
  ]

  const onSearchDocument = (sortBy: string, sortDirection: 'asc' | 'desc', page = 1) => {
    if (searchInput !== '') {
      setSearchMode(true)
    } else {
      setSearchMode(false)
    }
    setLoadingStatus(true)
    fetchDocuments(
      deidentifiedBoolean,
      sortBy,
      sortDirection,
      page,
      searchInput,
      selectedDocTypes,
      nda,
      startDate,
      endDate,
      groupId,
      encounters?.map((encounter) => encounter.id ?? '').filter((id) => id !== '')
    )
      .then((result) => {
        if (result) {
          const {
            totalDocs,
            totalAllDocs,
            documentsList
            // wordcloudData
          } = result
          setDocuments(documentsList)
          // if (wordcloudData) {
          //   setWordcloudData(wordcloudData)
          // }
          setDocumentsNumber(totalDocs)
          setAllDocumentsNumber(totalAllDocs)
          setPage(page)
        }
      })
      .catch((error) => console.log(error))
      .then(() => {
        setLoadingStatus(false)
      })
  }

  const handleOpenDialog = () => {
    setOpen(true)
  }

  const handleCloseDialog = (submit: boolean) => () => {
    setOpen(false)
    submit && onSearchDocument(_sortBy, _sortDirection)
  }

  const handleChangeInput = (event: any) => {
    setSearchInput(event.target.value)
  }

  const onKeyDown = async (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault()
      onSearchDocument(_sortBy, _sortDirection)
    }
  }

  const onChangeSortBy = (
    event: React.ChangeEvent<{}>,
    value: {
      label: string
      code: string
    } | null
  ) => {
    if (value) {
      setSortBy(value.code)
      onSearchDocument(value.code, _sortDirection)
    }
  }

  const onChangeSortDirection = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    if (value === 'asc' || value === 'desc') {
      setSortDirection(value)
      onSearchDocument(_sortBy, value)
    }
  }

  useEffect(() => {
    onSearchDocument(_sortBy, _sortDirection)
  }, []) // eslint-disable-line

  const documentsToDisplay =
    documents.length > documentLines ? documents.slice((page - 1) * documentLines, page * documentLines) : documents

  return (
    <Grid container direction="column" alignItems="center">
      <CssBaseline />
      <Grid container item xs={11} justify="space-between">
        <Typography variant="h2" className={classes.pageTitle}>
          Documents cliniques
        </Typography>

        {/* <Grid container spacing={3}>
          <Grid item xs={12}>
            {wordcloudData && (
              <Paper className={classes.chartOverlay}>
                <Grid container item className={classes.chartTitle}>
                  <Typography variant="h3" color="primary">
                    Mots les plus fréquents
                  </Typography>
                </Grid>
                <WordCloud wordcloudData={wordcloudData?.[0]?.extension} />
              </Paper>
            )}
          </Grid> 
        </Grid>*/}

        <Grid container item justify="flex-end" className={classes.tableGrid}>
          <Grid container justify="space-between" alignItems="center">
            <Typography variant="button">
              {documentsNumber} / {allDocumentsNumber} document(s)
            </Typography>
            <Grid container direction="row" alignItems="center" className={classes.filterAndSort}>
              <div className={classes.documentButtons}>
                <Grid item container xs={10} alignItems="center" className={classes.searchBar}>
                  <InputBase
                    placeholder="Rechercher"
                    className={classes.input}
                    value={searchInput}
                    onChange={handleChangeInput}
                    onKeyDown={onKeyDown}
                  />
                  <IconButton
                    type="submit"
                    aria-label="search"
                    onClick={() => onSearchDocument(_sortBy, _sortDirection)}
                  >
                    <SearchIcon fill="#ED6D91" height="15px" />
                  </IconButton>
                </Grid>
                <IconButton type="submit" onClick={() => setHelpOpen(true)}>
                  <InfoIcon />
                </IconButton>
                <DocumentSearchHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
                <Button
                  variant="contained"
                  disableElevation
                  onClick={handleOpenDialog}
                  startIcon={<FilterList height="15px" fill="#FFF" />}
                  className={classes.searchButton}
                >
                  Filtrer
                </Button>
              </div>
              <Autocomplete
                options={sortByNames}
                getOptionLabel={(option) => option.label}
                value={sortByNames.find((value) => value.code === _sortBy)}
                renderInput={(params) => <TextField {...params} label="Trier par :" variant="outlined" />}
                onChange={onChangeSortBy}
                className={classes.autocomplete}
              />
              <Typography variant="button">Ordre :</Typography>
              <RadioGroup
                value={_sortDirection}
                onChange={onChangeSortDirection}
                classes={{ root: classes.radioGroup }}
              >
                <FormControlLabel value="asc" control={<Radio />} label="Croissant" />
                <FormControlLabel value="desc" control={<Radio />} label="Décroissant" />
              </RadioGroup>
            </Grid>
          </Grid>
          <DocumentList
            loading={loadingStatus ?? false}
            documents={documentsToDisplay}
            searchMode={searchMode}
            showIpp={true}
            deidentified={deidentifiedBoolean}
            encounters={encounters}
          />
          <Pagination
            className={classes.pagination}
            count={Math.ceil((documentsNumber ?? 0) / documentLines)}
            shape="rounded"
            onChange={(event, page) => {
              if (documents.length <= documentLines) {
                onSearchDocument(_sortBy, _sortDirection, page)
              } else {
                setPage(page)
              }
            }}
            page={page}
          />
          <DocumentFilters
            open={open}
            onClose={handleCloseDialog(false)}
            onSubmit={handleCloseDialog(true)}
            nda={nda}
            onChangeNda={setNda}
            selectedDocTypes={selectedDocTypes}
            onChangeSelectedDocTypes={setSelectedDocTypes}
            startDate={startDate}
            onChangeStartDate={setStartDate}
            endDate={endDate}
            onChangeEndDate={setEndDate}
            deidentified={deidentifiedBoolean}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Documents
