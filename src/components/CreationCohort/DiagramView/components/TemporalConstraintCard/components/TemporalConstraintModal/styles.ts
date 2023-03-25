import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  title: {
    ' & h2': {
      fontSize: '18px',
      fontFamily: "'Montserrat', sans-serif",
      color: '#0063AF',
      textTransform: 'none',
      lineHeight: 2
    }
  }
}))

export default useStyles
