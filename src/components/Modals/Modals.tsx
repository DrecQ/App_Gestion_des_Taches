import { Notification, SharedUser } from "../../types/types";
import './Modals.css';

interface ShareModalProps {
  show: boolean;
  onClose: () => void;
  emailToShare: string;
  setEmailToShare: (email: string) => void;
  onShare: () => void;
  sharedUsers: SharedUser[];
  onRemoveAccess: (email: string) => void;
}

interface NotificationsModalProps {
  show: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export const ShareModal = ({
  show,
  onClose,
  emailToShare,
  setEmailToShare,
  onShare,
  sharedUsers,
  onRemoveAccess
}: ShareModalProps) => {
  if (!show) return null;

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3><i className="fas fa-share-alt"></i> Partager ma liste</h3>
        <div className="share-input-group">
          <input
            type="email"
            value={emailToShare}
            onChange={(e) => setEmailToShare(e.target.value)}
            placeholder="Entrez l'email à partager"
            onKeyDown={(e) => e.key === 'Enter' && onShare()}
          />
          <button 
            onClick={onShare} 
            disabled={!emailToShare.trim()}
            aria-label="Partager avec cet email"
          >
            <i className="fas fa-user-plus"></i> Ajouter
          </button>
        </div>
        
        {sharedUsers.length > 0 && (
          <div className="shared-users-section">
            <h4>Personnes avec accès :</h4>
            <ul className="shared-users-list">
              {sharedUsers.map(user => (
                <li key={user.id}>
                  <span className="user-info">
                    <i className="fas fa-user-circle"></i>
                    {user.name} ({user.email})
                    <span className="permission-badge">
                      {user.permission === 'write' ? 'Écriture' : 'Lecture'}
                    </span>
                  </span>
                  <button 
                    className="remove-access-btn"
                    onClick={() => onRemoveAccess(user.email)}
                    aria-label={`Révoquer l'accès pour ${user.email}`}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <button 
          className="close-modal-btn"
          onClick={onClose}
          aria-label="Fermer la modal de partage"
        >
          <i className="fas fa-times"></i> Fermer
        </button>
      </div>
    </div>
  );
};

export const NotificationsModal = ({
  show,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll
}: NotificationsModalProps) => {
  if (!show) return null;

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal-content notifications-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3><i className="fas fa-bell"></i> Mes notifications</h3>
        
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <i className="fas fa-bell-slash"></i>
            <p>Aucune notification</p>
          </div>
        ) : (
          <>
            <ul className="notifications-list">
              {notifications.map(notification => (
                <li 
                  key={notification.id || Math.random().toString()} 
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => notification.id && onMarkAsRead(notification.id)}
                >
                  <div className="notification-header">
                    <div className="notification-title-wrapper">
                      {notification.icon && (
                        <i className={`notification-icon ${notification.icon}`}></i>
                      )}
                      <h4>{notification.title}</h4>
                      {notification.type && (
                        <span className={`notification-type ${notification.type}`}>
                          {notification.type === 'task' ? 'Tâche' : 
                           notification.type === 'share' ? 'Partage' : 'Système'}
                        </span>
                      )}
                    </div>
                    <span className="notification-time">
                      {notification.timestamp ? new Date(notification.timestamp).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Date inconnue'}
                    </span>
                  </div>
                  <p className="notification-message">
                    {'message' in notification ? (notification as any).message : notification.body || ''}
                  </p>
                  {notification.data?.url && (
                    <a 
                      href={notification.data.url} 
                      className="notification-link"
                      onClick={e => e.stopPropagation()}
                    >
                      Voir plus
                    </a>
                  )}
                </li>
              ))}
            </ul>
            
            <button 
              className="clear-notifications-btn"
              onClick={onClearAll}
              disabled={notifications.length === 0}
              aria-label="Effacer toutes les notifications"
            >
              <i className="fas fa-trash"></i> Effacer toutes les notifications
            </button>
          </>
        )}
        
        <button 
          className="close-modal-btn"
          onClick={onClose}
          aria-label="Fermer la modal de notifications"
        >
          <i className="fas fa-times"></i> Fermer
        </button>
      </div>
    </div>
  );
};
