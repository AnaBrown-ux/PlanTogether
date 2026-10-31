import { NavLink } from 'react-router';
import { Dropdown } from 'react-bootstrap';
import { getAuth, signOut } from 'firebase/auth';

export default function NavBar(props) {
  const { currentUser } = props;
  
  function handleLogout() {
    const auth = getAuth();
    signOut(auth);
  }

  return (
    <header className="top-bar">
      <h1 className="logo">PlanTogether</h1>
      <nav className="top-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-active' : ''}>Home</NavLink>
        <NavLink to="/add-activity" className={({ isActive }) => isActive ? 'nav-active' : ''}>Add Activity</NavLink>
        <NavLink to="/invite" className={({ isActive }) => isActive ? 'nav-active' : ''}>Invite Friends</NavLink>
        <NavLink to="/calendar" className={({ isActive }) => isActive ? 'nav-active' : ''}>Calendar</NavLink>
      </nav>
      
      <>
        {currentUser.userId === null ? (

          <NavLink
            to="/signin"
            className="signup-btn"
          >
            Sign In
          </NavLink>

        ) : (

          <Dropdown align="end">

            <Dropdown.Toggle
              variant="light"
              className="profile-dropdown"
            >

              <img
                src={currentUser.userImg}
                alt={currentUser.userName}
                className="profile-avatar"
              />

            </Dropdown.Toggle>

            <Dropdown.Menu>

              <Dropdown.Header>
                {currentUser.userName}
              </Dropdown.Header>

              <Dropdown.Item
                onClick={handleLogout}
              >
                Logout
              </Dropdown.Item>

            </Dropdown.Menu>

          </Dropdown>

        )}
      </>

    </header>
  );
}
