import { createStyles, makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) =>
  createStyles({
    documentTable: {
      margin: '0 auto'
    },
    documentButtons: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    searchBar: {
      minWidth: 200,
      backgroundColor: '#FFF',
      border: '1px solid #D0D7D8',
      boxShadow: '0px 1px 16px #0000000A',
      borderRadius: '25px'
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1
    },
    searchButton: {
      minWidth: 150,
      backgroundColor: '#5BC5F2',
      color: '#FFF',
      borderRadius: '25px',
      marginLeft: 8
    },
    root: {
      backgroundColor: '#153D8A',
      borderRadius: '8px',
      color: 'white',
      minHeight: 41
    },
    tabTitle: {
      minWidth: 0,
      color: 'white',
      fontWeight: '400',
      borderBottom: '#255CA1 inset 4px',
      minHeight: 41
    },
    indicator: {
      backgroundColor: '#5BC5F2',
      height: '4px'
    },
    selected: {
      backgroundColor: '#0063AF'
    },
    table: {
      minWidth: 650
    },
    tableHead: {
      height: 42,
      backgroundColor: '#D1E2F4',
      textTransform: 'uppercase'
    },
    tableHeadCell: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#0063AF',
      padding: '0 20px'
    },
    tableBodyRows: {
      height: '80px',
      '&:nth-of-type(even)': {
        backgroundColor: '#FAF9F9'
      }
    },
    libelle: {
      fontWeight: 'bold'
    },
    pagination: {
      margin: '10px 0',
      float: 'right',
      '& button': {
        backgroundColor: '#fff',
        color: '#5BC5F2'
      },
      '& .MuiPaginationItem-page.Mui-selected': {
        color: '#0063AF',
        backgroundColor: '#FFF'
      }
    },
    chips: {
      margin: '12px 6px',
      '&:last-child': {
        marginRight: 0
      }
    },
    filterAndSort: {
      '& > *': { marginBottom: 5 }
    }
  })
)
