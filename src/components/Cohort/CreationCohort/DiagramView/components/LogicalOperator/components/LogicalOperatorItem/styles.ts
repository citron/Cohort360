import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  mainLogicalOperator: {
    background: '#19235A',
    color: 'white',
    width: 42,
    height: 42,
    maxWidth: 42,
    maxHeight: 42,
    minWidth: 42,
    minHeight: 42,
    borderRadius: 5,
    textAlign: 'center',
    marginTop: 12,
    position: 'relative',
    '&::after': {
      position: 'absolute',
      content: "''",
      height: 12,
      width: 3,
      background: '#19235a',
      top: '100%',
      left: 19
    }
  },
  logicalOperator: {
    background: '#19235A',
    color: 'white',
    height: 42,
    minWidth: 42,
    minHeight: 42,
    width: 'fit-content !important',
    maxWidth: 'inherit !important',
    borderRadius: 5,
    textAlign: 'center',
    marginTop: 12,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    '&::before': {
      position: 'absolute',
      content: "''",
      height: 3,
      width: 35,
      background: '#19235a',
      top: 19.5,
      left: -35
    },
    '&::after': {
      position: 'absolute',
      content: "''",
      height: 12,
      width: 3,
      background: '#19235a',
      top: '100%',
      left: 19
    }
  }
}))

export default useStyles
