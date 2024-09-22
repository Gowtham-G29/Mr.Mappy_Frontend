import Box from '@mui/joy/Box';
import ChipDelete from '@mui/joy/ChipDelete';
import DeleteForever from '@mui/icons-material/DeleteForever';

export default function DeleteButton() {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      
        
          <ChipDelete
            color="danger"
            variant="plain"
            // onClick={() => alert('You clicked the delete button!')}
          >
            <DeleteForever />
          </ChipDelete>
    
        
    </Box>
  );
}
