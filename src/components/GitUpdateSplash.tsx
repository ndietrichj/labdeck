import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

type GitUpdateState = 'checking' | 'up_to_date' | 'updated' | 'skipped_dirty' | 'failed';

type GitUpdateResponse = {
  status: GitUpdateState;
  message: string;
};

export function GitUpdateSplash({ onComplete }: { onComplete: () => void }) {
  const [status, setStatus] = useState<GitUpdateResponse>({
    status: 'checking',
    message: 'Checking for LabDeck updates...',
  });

  useEffect(() => {
    let cancelled = false;

    const finishSoon = () => {
      window.setTimeout(() => {
        if (!cancelled) onComplete();
      }, 1500);
    };

    const checkForUpdates = async () => {
      try {
        const response = await invoke<GitUpdateResponse>('check_updates');
        if (!cancelled) {
          setStatus(response);
        }
      } catch (error) {
        console.error('Update check failed:', error);
        if (!cancelled) {
          setStatus({
            status: 'failed',
            message: 'Update check failed, continuing offline.',
          });
        }
      } finally {
        finishSoon();
      }
    };

    checkForUpdates();

    return () => {
      cancelled = true;
    };
  }, [onComplete]);

  const getBackgroundColor = () => {
    switch (status.status) {
      case 'checking':
        return '#2563eb';
      case 'up_to_date':
      case 'updated':
        return '#059669';
      case 'skipped_dirty':
        return '#d97706';
      case 'failed':
        return '#dc2626';
      default:
        return '#1e293b';
    }
  };

  const getIcon = () => {
    switch (status.status) {
      case 'checking':
        return '⏳';
      case 'up_to_date':
        return '✓';
      case 'updated':
        return '↻';
      case 'skipped_dirty':
      case 'failed':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div
      className="git-update-splash"
      style={{ backgroundColor: getBackgroundColor() }}
    >
      <div className="git-update-card">
        <div className={`git-update-icon ${status.status === 'checking' ? 'is-checking' : ''}`}>
          {getIcon()}
        </div>
        <h1>LabDeck</h1>
        <p>{status.message}</p>
        {status.status === 'checking' && (
          <div className="git-update-dots" aria-label="Checking for updates">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>
    </div>
  );
}
