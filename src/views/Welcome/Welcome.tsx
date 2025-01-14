import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import moment from 'moment'

import { Alert, Container, Grid, Paper, Typography } from '@mui/material'

import NewsCard from 'components/Welcome/NewsCard/NewsCard'
import PatientsCard from 'components/Welcome/PatientsCard/PatientsCard'
import SearchPatientCard from 'components/Welcome/SearchPatientCard/SearchPatientCard'
import TutorialsCard from 'components/Welcome/TutorialsCard/TutorialsCard'
import CohortsTable from 'components/CohortsTable'
import RequestsTable from 'components/Requests/PreviewTable'
import PreviewCard from 'components/ui/Cards/PreviewCard'

import { useAppDispatch, useAppSelector } from 'state'
import { fetchCohorts } from 'state/cohort'
import { fetchProjects } from 'state/project'
import { fetchRequests } from 'state/request'
import { initPmsiHierarchy } from 'state/pmsi'
import { initMedicationHierarchy } from 'state/medication'
import { initBiologyHierarchy } from 'state/biology'
import { AccessExpiration, RequestType, WebSocketJobName, WebSocketJobStatus, WebSocketMessage } from 'types'
import useStyles from './styles'
import { CohortsType } from 'types/cohorts'
import { Direction, Order } from 'types/searchCriterias'
import { WebSocketContext } from 'components/WebSocket/WebSocketProvider'
import servicesCohorts from 'services/aphp/serviceCohorts'

const Welcome = () => {
  const { classes, cx } = useStyles()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const practitioner = useAppSelector((state) => state.me)
  const open = useAppSelector((state) => state.drawer)
  const cohortState = useAppSelector((state) => state.cohort)
  const requestState = useAppSelector((state) => state.request)
  const meState = useAppSelector((state) => state.me)
  const [lastRequest, setLastRequest] = useState<RequestType[]>([])
  const [cohortList, setCohortList] = useState(cohortState.cohortsList)
  const accessExpirations: AccessExpiration[] = meState?.accessExpirations ?? []
  const maintenanceIsActive = meState?.maintenance?.active

  const webSocketContext = useContext(WebSocketContext)

  const lastConnection = practitioner?.lastConnection
    ? moment(practitioner.lastConnection).format('[Dernière connexion : ]ddd DD MMMM YYYY[, à ]HH:mm')
    : ''

  const fetchCohortsPreview = () => {
    dispatch(
      fetchCohorts({
        options: {
          limit: 5,
          searchCriterias: {
            searchInput: '',
            orderBy: { orderBy: Order.MODIFIED, orderDirection: Direction.DESC },
            filters: {
              status: [],
              minPatients: null,
              maxPatients: null,
              startDate: null,
              endDate: null,
              favorite: CohortsType.FAVORITE
            }
          }
        }
      })
    )
    dispatch(
      fetchCohorts({
        options: {
          limit: 5
        }
      })
    )
  }

  useEffect(() => {
    dispatch(fetchProjects())
    dispatch(fetchRequests())
    dispatch(initPmsiHierarchy())
    dispatch(initMedicationHierarchy())
    dispatch(initBiologyHierarchy())
    fetchCohortsPreview()
  }, [])

  useEffect(() => {
    const _lastRequest =
      requestState.requestsList?.length > 0
        ? [...requestState.requestsList]
            .sort((a, b) => +moment(b?.updated_at).format('X') - +moment(a.updated_at).format('X'))
            .splice(0, 5)
        : []
    setLastRequest(_lastRequest)
  }, [requestState])

  useEffect(() => {
    setCohortList(cohortState.cohortsList)
  }, [cohortState.cohortsList])

  useEffect(() => {
    const listener = async (message: WebSocketMessage) => {
      if (message.job_name === WebSocketJobName.CREATE && message.status === WebSocketJobStatus.finished) {
        const websocketUpdatedCohorts = cohortList.map((cohort) => {
          const temp = Object.assign({}, cohort)
          if (temp.uuid === message.uuid) {
            if (temp.dated_measure_global) {
              temp.dated_measure_global = {
                ...temp.dated_measure_global,
                measure_min: message.extra_info?.global ? message.extra_info.global.measure_min : null,
                measure_max: message.extra_info?.global ? message.extra_info.global.measure_max : null
              }
            }
            temp.request_job_status = message.status
            temp.group_id = message.extra_info?.group_id
          }
          return temp
        })
        const newCohortList = await servicesCohorts.fetchCohortsRights(websocketUpdatedCohorts)
        setCohortList(newCohortList)
      }
    }

    webSocketContext?.addListener(listener)
    return () => webSocketContext?.removeListener(listener)
  }, [cohortList, webSocketContext])

  return practitioner ? (
    <Grid
      container
      className={cx(classes.root, classes.appBar, {
        [classes.appBarShift]: open
      })}
    >
      <Container
        maxWidth="lg"
        className={classes.container}
        style={{ minHeight: 'calc(100vh - 70px)', marginBottom: 8 }}
      >
        <Grid item xs={12}>
          <Grid item>
            <Typography
              id="homePage-title"
              component="h1"
              variant="h1"
              color="inherit"
              noWrap
              className={classes.title}
            >
              {`Bienvenue ${
                practitioner.impersonation
                  ? practitioner.impersonation.firstname + ' ' + practitioner.impersonation.lastname
                  : practitioner.displayName
              }`}
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              id="last-connection"
              component="h6"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.subtitle}
            >
              {lastConnection}
            </Typography>
          </Grid>
          <Grid item>
            {maintenanceIsActive && (
              <Alert severity="warning" className={classes.alert}>
                Une maintenance est en cours. Seules les consultations de cohortes, requêtes et données patients sont
                activées. Les créations, éditions et suppressions de cohortes et de requêtes sont désactivées.
              </Alert>
            )}
            {accessExpirations
              .filter((item) => item.leftDays && !Number.isNaN(item.leftDays) && item.leftDays <= 30)
              .map((item: AccessExpiration) => (
                <Alert
                  key={item.perimeter + '-' + item.leftDays && item.leftDays}
                  severity="warning"
                  className={classes.alert}
                >
                  Attention, votre accès au périmètre suivant: {item.perimeter}, arrivera à expiration dans{' '}
                  {item.leftDays} jour{item.leftDays > 1 ? 's' : ''}. Veuillez vous rapprocher de votre référent EDS
                  pour faire renouveler vos accès à l'application.
                </Alert>
              ))}
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          <Grid container className={classes.newsGrid} item xs={12} md={6}>
            <Grid item className={classes.pt3}>
              <Paper
                id="patients-card"
                className={classes.paper}
                style={{ maxHeight: 150, minHeight: 150, height: 150 }}
              >
                <PatientsCard />
              </Paper>
            </Grid>

            <Grid item className={classes.pt3}>
              <Paper id="news-card" className={classes.paper} style={{ maxHeight: 450, minHeight: 450, height: 450 }}>
                <NewsCard />
              </Paper>
            </Grid>
          </Grid>

          <Grid container item xs={12} md={6}>
            <Grid item xs={12} className={classes.pt3}>
              <Paper
                id="search-patient-card"
                className={classes.paper}
                style={{ maxHeight: 150, minHeight: 150, height: 150 }}
              >
                <SearchPatientCard />
              </Paper>
            </Grid>

            <Grid item xs={12} className={classes.pt3}>
              <Paper
                id="tutorials-card"
                className={classes.paper}
                style={{ maxHeight: 450, minHeight: 450, height: 450 }}
              >
                <TutorialsCard />
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <Grid container item style={{ paddingTop: 12 }}>
          <Grid item xs={12}>
            <Paper id="favorite-cohort-research-card" className={classes.paper}>
              <PreviewCard
                title={'Mes cohortes favorites'}
                linkLabel={'Voir toutes mes cohortes favorites'}
                onClickLink={() => navigate('/my-cohorts/favorites')}
              >
                <CohortsTable
                  data={cohortState.favoriteCohortsList}
                  loading={cohortState.loading}
                  simplified
                  onUpdate={() => fetchCohortsPreview()}
                />
              </PreviewCard>
            </Paper>
          </Grid>
        </Grid>
        <Grid container item style={{ paddingTop: 12 }}>
          <Grid item xs={12}>
            <Paper id="last-created-cohort-research-card" className={classes.paper}>
              <PreviewCard
                title={'Mes dernières cohortes créées'}
                linkLabel={'Voir toutes mes cohortes'}
                onClickLink={() => navigate('/my-cohorts')}
              >
                <CohortsTable
                  data={cohortList}
                  loading={cohortState.loading}
                  simplified
                  onUpdate={() => fetchCohortsPreview()}
                />
              </PreviewCard>
            </Paper>
          </Grid>
        </Grid>
        <Grid container item style={{ paddingTop: 12 }}>
          <Grid item xs={12}>
            <Paper id="last-created-request-research-card" className={classes.paper}>
              <PreviewCard
                title={'Mes dernières requêtes créées'}
                linkLabel={'Voir toutes mes requêtes'}
                onClickLink={() => navigate('/my-requests')}
              >
                <RequestsTable data={lastRequest} loading={requestState.loading} />
              </PreviewCard>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  ) : null
}

export default Welcome
