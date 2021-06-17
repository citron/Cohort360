import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Chip from '@material-ui/core/Chip'
import Tooltip from '@material-ui/core/Tooltip'

import Skeleton from '@material-ui/lab/Skeleton'

import GroupIcon from '@material-ui/icons/Group'
import BusinessIcon from '@material-ui/icons/Business'
import ViewListIcon from '@material-ui/icons/ViewList'
import FaceIcon from '@material-ui/icons/Face'
import CloseIcon from '@material-ui/icons/Close'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'

import { ReactComponent as StarIcon } from 'assets/icones/star.svg'
import { ReactComponent as StarFullIcon } from 'assets/icones/star full.svg'
import MoreButton from '@material-ui/icons/MoreVert'

import { useAppSelector } from 'state'
import { favoriteExploredCohort } from 'state/exploredCohort'

import displayDigit from 'utils/displayDigit'

import useStyles from './styles'

type TopBarProps = {
  context: 'patients' | 'cohort' | 'perimeters' | 'patient_info'
  patientsNb?: number
  access?: string
}

const TopBar: React.FC<TopBarProps> = ({ context, patientsNb, access }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const { dashboard } = useAppSelector((state) => ({
    dashboard: state.exploredCohort
  }))
  const [isExtended, onExtend] = useState(false)

  let cohort: {
    name: string
    description?: string
    perimeters?: string[]
    icon?: React.ReactElement
    showActionButton?: boolean
  } = { name: '-', perimeters: [] }
  switch (context) {
    case 'patients':
      cohort = {
        name: 'Tous mes patients',
        description: '',
        perimeters: [],
        icon: <GroupIcon />,
        showActionButton: false
      }
      break
    case 'patient_info':
      cohort = {
        name: 'Information patient',
        description: '',
        // description: Array.isArray(dashboard.cohort)
        //   ? 'Visualisation de périmètres'
        //   : dashboard?.cohort?.name
        //   ? dashboard?.cohort?.name === '-'
        //     ? 'Exploration de population'
        //     : 'Exploration de cohorte '
        //   : "Visualisation d'un patient",
        perimeters: [],
        icon: <FaceIcon />,
        showActionButton: false
      }
      break
    case 'cohort':
      cohort = {
        name: dashboard.name ?? '-',
        description: dashboard.description ?? '',
        perimeters: [],
        icon: <ViewListIcon />,
        showActionButton: true
      }
      break
    case 'perimeters':
      cohort = {
        name: 'Exploration de périmètres',
        description: '',
        perimeters:
          dashboard.cohort && Array.isArray(dashboard.cohort)
            ? dashboard.cohort.map((p: any) => p.name.replace('Patients passés par: ', ''))
            : [],
        icon: <BusinessIcon />,
        showActionButton: false
      }
      break
    default:
      break
  }

  const handleFavorite = () => {
    dispatch(favoriteExploredCohort({ id: dashboard.uuid ?? '' }))
  }

  return (
    <Grid xs={12} container direction="row">
      <Grid xs={12} item direction="row">
        <Paper className={classes.root} square>
          <Grid container item style={{ paddingInline: 8 }} justify="space-between">
            <Grid
              container
              item
              direction="row"
              style={{ paddingLeft: 12, width: cohort.showActionButton ? 'calc(100% - 120px)' : 'calc(100% - 20px)' }}
            >
              <Grid item xs={9} direction="row" container>
                <Grid container style={{ width: 'fit-content' }} alignItems="center">
                  <Avatar style={{ backgroundColor: '#5bc5f1' }}>{cohort.icon}</Avatar>
                </Grid>

                <Grid
                  container
                  style={{ width: 'calc(100% - 48px)', marginLeft: 8 }}
                  direction="column"
                  justify="center"
                >
                  {dashboard.loading ? (
                    <>
                      <Skeleton width={100} />
                      <Skeleton width={100} />
                    </>
                  ) : (
                    <>
                      {cohort.name && <Typography variant="h5">{cohort.name} </Typography>}
                      {cohort.description && (
                        <Tooltip title={cohort.description}>
                          <Typography noWrap style={{ width: '100%' }} variant="subtitle2">
                            {cohort.description}
                          </Typography>
                        </Tooltip>
                      )}
                    </>
                  )}

                  {context === 'perimeters' && (
                    <List className={classes.perimetersChipsDiv}>
                      {isExtended ? (
                        <>
                          {cohort.perimeters &&
                            cohort.perimeters.map((perimeter: any) => (
                              <ListItem key={perimeter} className={classes.item}>
                                <Chip className={classes.perimetersChip} label={perimeter} />
                              </ListItem>
                            ))}
                          <IconButton
                            size="small"
                            classes={{ label: classes.populationLabel }}
                            onClick={() => onExtend(false)}
                          >
                            <CloseIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          {cohort.perimeters &&
                            cohort.perimeters.slice(0, 4).map((perimeter) => (
                              <ListItem key={perimeter} className={classes.item}>
                                <Chip className={classes.perimetersChip} label={perimeter} />
                              </ListItem>
                            ))}
                          {cohort.perimeters && cohort.perimeters.length > 4 && (
                            <IconButton
                              size="small"
                              classes={{ label: classes.populationLabel }}
                              onClick={() => onExtend(true)}
                            >
                              <MoreHorizIcon />
                            </IconButton>
                          )}
                        </>
                      )}
                    </List>
                  )}
                </Grid>
              </Grid>

              <Grid item xs={3} direction="column" container justify="center" alignItems="flex-end">
                {dashboard.loading ? (
                  <>
                    <Skeleton width={100} />
                    <Skeleton width={100} />
                  </>
                ) : (
                  <>
                    <Typography align="right" noWrap>
                      Nb de patients : {displayDigit(patientsNb ?? 0)}
                    </Typography>
                    <Typography align="right" noWrap>
                      Accès : {access}
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>

            {cohort.showActionButton && (
              <Grid container item justify="flex-end" style={{ width: 'fit-content' }}>
                <IconButton onClick={handleFavorite} color="secondary">
                  {dashboard.favorite ? (
                    <StarFullIcon height={18} fill="currentColor" />
                  ) : (
                    <StarIcon height={18} fill="currentColor" />
                  )}
                </IconButton>

                <IconButton>
                  <MoreButton />
                </IconButton>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Grid>
      {context !== 'patient_info' && (
        <Divider orientation="horizontal" variant="middle" style={{ width: 'calc(100% - 32px)' }} />
      )}
    </Grid>
  )
}

export default TopBar
