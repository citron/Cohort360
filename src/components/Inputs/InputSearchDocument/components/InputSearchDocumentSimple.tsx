import React, { useEffect, useState } from 'react'

import { Grid, IconButton, InputAdornment, InputBase } from '@material-ui/core'

import InfoIcon from '@material-ui/icons/Info'
import ClearIcon from '@material-ui/icons/Clear'
import { ReactComponent as SearchIcon } from 'assets/icones/search.svg'

import DocumentSearchHelp from 'components/DocumentSearchHelp/DocumentSearchHelp'

import useStyles from './styles'

type InputSearchDocumentSimpleProps = {
  defaultSearchInput?: string
  setDefaultSearchInput?: (newSearchInput: string) => void
  onSearchDocument: (newInputText: string) => void
}
const InputSearchDocumentSimple: React.FC<InputSearchDocumentSimpleProps> = ({
  defaultSearchInput,
  setDefaultSearchInput,
  onSearchDocument
}) => {
  const classes = useStyles()

  const [searchInput, setSearchInput] = useState<string>(defaultSearchInput ?? '')
  const [helpOpen, setHelpOpen] = useState(false)

  const handleChangeInput = (event: any) => {
    setSearchInput(event.target.value)
    if (setDefaultSearchInput && typeof setDefaultSearchInput === 'function') {
      setDefaultSearchInput(event.target.value)
    }
  }

  const handleClearInput = () => {
    setSearchInput('')
    onSearchDocument('')
    if (setDefaultSearchInput && typeof setDefaultSearchInput === 'function') {
      setDefaultSearchInput('')
    }
  }

  const onKeyDown = async (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault()
      onSearchDocument(searchInput)
    }
  }

  useEffect(() => {
    setSearchInput(defaultSearchInput ?? '')
  }, [defaultSearchInput])

  return (
    <>
      <IconButton size="small" onClick={() => setHelpOpen(true)}>
        <InfoIcon />
      </IconButton>

      <Grid item container xs={10} alignItems="center" className={classes.searchBar}>
        <InputBase
          placeholder="Rechercher dans les documents"
          className={classes.input}
          value={searchInput}
          onChange={handleChangeInput}
          onKeyDown={onKeyDown}
          endAdornment={
            <InputAdornment position="end">
              {searchInput && (
                <IconButton onClick={handleClearInput}>
                  <ClearIcon />
                </IconButton>
              )}
            </InputAdornment>
          }
        />

        <IconButton type="submit" aria-label="search" onClick={() => onSearchDocument(searchInput)}>
          <SearchIcon fill="#ED6D91" height="15px" />
        </IconButton>

        <DocumentSearchHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
      </Grid>
    </>
  )
}

export default InputSearchDocumentSimple
