import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import "../styles/PageSelector.css"

const PageSelector = (
    {page, url, pages, limit}:
    {page: number, url: string, pages: number, limit: number}
) => {

    return (
        <Stack spacing={2} className='pageSelectorContainer'>
            <Pagination count={pages} />
        </Stack>
    );
};

export default PageSelector;
