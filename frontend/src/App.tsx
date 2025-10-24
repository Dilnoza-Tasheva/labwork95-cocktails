import { Route, Routes } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import {useAppSelector} from "./app/hooks.ts";
import {selectUser} from "./features/users/usersSlice.ts";
import Register from "./features/users/Register.tsx";
import Login from "./features/users/Login.tsx";
import AppToolbar from "./components/UI/AppToolBar/AppToolBar.tsx";
import PublicList from "./features/cocktails/PublicList.tsx";
import ProtectedRoute from "./components/UI/ProtectedRoute/ProtectedRoute.tsx";
import MineCocktails from "./features/cocktails/MineCocktails.tsx";
import NewCocktail from "./features/cocktails/NewCocktail.tsx";
import OneCocktail from "./features/cocktails/OneCocktail.tsx";

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
              <Route path="/" element={<PublicList />} />
              <Route path="/cocktails/mine" element={<ProtectedRoute isAllowed={Boolean(user)}><MineCocktails /></ProtectedRoute>} />
              <Route path="/cocktails/new" element={<ProtectedRoute isAllowed={Boolean(user)}><NewCocktail /></ProtectedRoute>} />
              <Route path="/cocktails/:id" element={<OneCocktail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Typography>Not found</Typography>} />
          </Routes>
        </Container>
      </>
  );
};
export default App;
