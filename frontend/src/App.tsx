import { Route, Routes } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import {useAppSelector} from "./app/hooks.ts";
import {selectUser} from "./features/users/usersSlice.ts";
import Register from "./features/users/Register.tsx";
import Login from "./features/users/Login.tsx";
import AppToolbar from "./components/UI/AppToolBar/AppToolBar.tsx";

const App = () => {
  const user = useAppSelector(selectUser);


  return (
      <>
        <header><AppToolbar /></header>
        <Container maxWidth="xl" component="main">
          {user && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <Button component={Link} to="/cocktails/new">Add cocktail</Button>
              </div>
          )}
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Typography>Not found</Typography>} />
          </Routes>
        </Container>
      </>
  );
};
export default App;
