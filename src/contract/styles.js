export const styles = {
    container: { width: '100%', mb: 4, p: 3 },
    toolbar: { display: 'flex', alignItems: 'center', mb: 3, gap: 2 },
    addButton: { minWidth: 200 },
    searchField: { minWidth: 300 },
    tableContainer: { marginRight: 3 },
    table: { minWidth: 650 },
    tableHeader: { fontWeight: 'bold' },
    tableRow: { 
      cursor: 'pointer',
      '&:nth-of-type(odd)': {
        backgroundColor: theme => theme.palette.action.hover,
      },
    },
  };