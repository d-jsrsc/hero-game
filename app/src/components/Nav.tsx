import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ButtonGroup, Container, Dropdown, DropdownButton, Nav, Navbar } from 'react-bootstrap';
import { useWrapConfig } from '../hooks';

export function NavHeader() {
  const { network, setNetwork } = useWrapConfig();
  return (
    <Navbar collapseOnSelect expand="lg" bg="light">
      <Container>
        <Navbar.Brand href="#home">HeroWorld</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {/* <Nav.Link as={Link} to="/">
              Market
            </Nav.Link>
            <Nav.Link as={Link} to="/heros">
              Heros
            </Nav.Link> */}
          </Nav>
          <Nav>
            <ButtonGroup className="mb-2">
              <WalletMultiButton
                style={{
                  width: '150px'
                }}
              />
              <DropdownButton
                as={ButtonGroup}
                variant="outline-primary"
                align="end"
                size="lg"
                title={network}
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onSelect={(eventKey: string | null, _e: unknown) => {
                  if (!eventKey) return;
                  // setNetwork(eventKey);
                  setNetwork(eventKey as WalletAdapterNetwork);
                }}>
                <Dropdown.Item eventKey={WalletAdapterNetwork.Mainnet}>
                  {WalletAdapterNetwork.Mainnet}
                </Dropdown.Item>
                <Dropdown.Item eventKey={WalletAdapterNetwork.Testnet}>
                  {WalletAdapterNetwork.Testnet}
                </Dropdown.Item>
                <Dropdown.Item eventKey={WalletAdapterNetwork.Devnet}>
                  {WalletAdapterNetwork.Devnet}
                </Dropdown.Item>
              </DropdownButton>
            </ButtonGroup>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
