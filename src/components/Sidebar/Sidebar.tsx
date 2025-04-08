// Sidebar.tsx
import { User } from "../../types/types";

interface SidebarProps {
  user: User;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  notificationsCount: number;
  onLogout: () => void;
  onShowNotifications: () => void;
  onShowShareModal: () => void;
  isMobileView: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const Sidebar = ({
  user,
  activeMenu,
  setActiveMenu,
  notificationsCount,
  onLogout,
  onShowNotifications,
  onShowShareModal,
  isMobileView,
  isMenuOpen,
  setIsMenuOpen
}: SidebarProps) => {
  return (
    <>
      {isMobileView && (
        <>
          <button 
            className="menu-toggle" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
          
          {isMenuOpen && (
            <div 
              className="sidebar-overlay"
              onClick={() => setIsMenuOpen(false)}
            ></div>
          )}
        </>
      )}

      <aside className={`sidebar ${isMenuOpen ? 'active' : ''}`}>
        <div className="user-profile">
          <div className="user-avatar"><i className="fas fa-user-circle"></i></div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <button onClick={onLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Déconnexion
          </button>
        </div>

        <nav className="sidebar-menu">
          <button 
            onClick={() => {
              setActiveMenu('today');
              if (isMobileView) setIsMenuOpen(false);
            }} 
            className={`menu-item ${activeMenu === 'today' ? 'active' : ''}`}
          >
            <span className="menu-icon"><i className="fas fa-sun"></i></span>
            <span>Ma journée</span>
          </button>
          
          <button 
            onClick={() => {
              setActiveMenu('planned');
              if (isMobileView) setIsMenuOpen(false);
            }} 
            className={`menu-item ${activeMenu === 'planned' ? 'active' : ''}`}
          >
            <span className="menu-icon"><i className="fas fa-calendar-alt"></i></span>
            <span>Planifié</span>
          </button>
          
          <button 
            onClick={() => {
              setActiveMenu('important');
              if (isMobileView) setIsMenuOpen(false);
            }} 
            className={`menu-item ${activeMenu === 'important' ? 'active' : ''}`}
          >
            <span className="menu-icon"><i className="fas fa-star"></i></span>
            <span>Important</span>
          </button>
          
          <button 
            onClick={() => {
              setActiveMenu('completed');
              if (isMobileView) setIsMenuOpen(false);
            }} 
            className={`menu-item ${activeMenu === 'completed' ? 'active' : ''}`}
          >
            <span className="menu-icon"><i className="fas fa-check-circle"></i></span>
            <span>Terminées</span>
          </button>

          <div className="menu-divider"></div>
          
          <button 
            onClick={() => {
              onShowNotifications();
              if (isMobileView) setIsMenuOpen(false);
            }}
            className="menu-item"
          >
            <span className="menu-icon"><i className="fas fa-bell"></i></span>
            <span>Mes notifications</span>
            {notificationsCount > 0 && (
              <span className="notification-badge">
                {notificationsCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => {
              onShowShareModal();
              if (isMobileView) setIsMenuOpen(false);
            }}
            className="menu-item share-menu"
          >
            <span className="menu-icon"><i className="fas fa-share-alt"></i></span>
            <span>Partager ma liste</span>
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;