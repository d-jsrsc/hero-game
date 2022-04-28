import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import { NavHeader } from './Nav';

export default function Layout() {
  return (
    <>
      <NavHeader />

      <Container>
        <Outlet />
      </Container>
    </>
  );
}
