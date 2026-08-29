import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import "../styles/PageSelector.css";

const PageSelector = ({
  page,
  pages,
  setPage,
}: {
  page: number;
  pages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <Stack spacing={2} className="pageSelectorContainer">
      <Pagination
        count={pages}
        page={page}
        onChange={(_, value) => setPage(value)}
      />
    </Stack>
  );
};

export default PageSelector;
