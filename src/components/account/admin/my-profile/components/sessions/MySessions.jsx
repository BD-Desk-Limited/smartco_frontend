import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaLaptopHouse } from 'react-icons/fa';
import Spinner from '@/components/account/common/Spinner';
import Button from '@/components/account/common/Button';
import ErrorInterface from '@/components/account/common/errorInterface';
import WarningModal from '@/components/account/common/WarningModal';
import { useAuth } from '@/contexts/authContext';
import {
  getMySessionsService,
  revokeOtherSessionsService,
  revokeSessionService,
} from '@/services/sessionServices';
import { sessionColumns, SessionAction } from './SessionRow';
import ResponsiveTable from '@/components/account/admin/ui/ResponsiveTable';

// Devices where the logged in user is (or recently was) signed in.
const MySessions = () => {
  const { logOut } = useAuth();
  const [sessions, setSessions] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [showEnded, setShowEnded] = useState(false);
  const [busyId, setBusyId] = useState(null); // session being signed out, or 'others'
  const [confirm, setConfirm] = useState(null); // { type: 'one', session } | { type: 'others' }

  // logOut changes identity whenever the auth provider re-renders; a ref keeps `load` stable.
  const logOutRef = useRef(logOut);
  logOutRef.current = logOut;

  const load = useCallback(async () => {
    setLoadError(null);
    const response = await getMySessionsService();
    if (response.sessionEnded) return logOutRef.current();
    if (response.error) setLoadError(response.error);
    else setSessions(response.data.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const runConfirmed = async () => {
    const action = confirm;
    setBusyId(action.type === 'one' ? action.session._id : 'others');
    setError(null);
    setNotice(null);
    try {
      const response =
        action.type === 'one'
          ? await revokeSessionService(action.session._id)
          : await revokeOtherSessionsService();
      if (response.error) {
        setError(response.error);
        return;
      }
      setNotice(response.data.message);
      await load();
    } finally {
      setBusyId(null);
      setConfirm(null);
    }
  };

  if (!sessions) {
    return loadError ? (
      <div className="flex flex-col items-center gap-3 py-10">
        <ErrorInterface error={loadError} />
        <Button onClick={load} text="Try again" buttonStyle="px-5" />
      </div>
    ) : (
      <Spinner />
    );
  }

  // Current device first, then most recently active.
  const active = sessions
    .filter((s) => s.status === 'active')
    .sort((a, b) => Number(b.isCurrent) - Number(a.isCurrent));
  const ended = sessions.filter((s) => s.status !== 'active');
  const othersActive = active.filter((s) => !s.isCurrent).length;
  const rows = showEnded ? [...active, ...ended] : active;

  return (
    <div className="flex flex-col gap-5 text-text-gray w-full">
      <section className="flex flex-row items-start justify-between gap-4 flex-wrap border-b border-gray-border pb-4 sticky top-[-20] z-40 bg-text-white">
        <div className="flex flex-row gap-3">
          <FaLaptopHouse className="text-2xl mt-1 text-brand-blue" />
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-text-black">
              My sessions
            </h2>
            <p className="text-sm">
              {active.length} active device{active.length === 1 ? '' : 's'}. If
              you don&apos;t recognise one, sign it out and change your
              password.
            </p>
          </div>
        </div>
        {othersActive > 0 && (
          <Button
            onClick={() => setConfirm({ type: 'others' })}
            loading={busyId === 'others'}
            loadingText="Signing out..."
            text="Sign out all other devices"
            buttonStyle="bg-error hover:bg-error-hover px-4"
          />
        )}
      </section>

      <section className="flex flex-col rounded-lg overflow-hidden shadow-md bg-white">
        <h2 className="bg-brand-blue text-text-white text-center text-lg py-4">
          Active Sessions
        </h2>

        <div className="px-3 sm:px-8 pt-4 pb-2 min-h-[240px]">
          <ResponsiveTable
            align="left"
            maxHeightClass=""
            rows={rows}
            emptyMessage="No active sessions."
            rowClassName={(session) =>
              session.status === 'active' ? '' : 'opacity-60'
            }
            columns={sessionColumns}
            actionsHeader="Action"
            actions={(session) => (
              <SessionAction
                session={session}
                busy={busyId === session._id}
                onSignOut={(s) => setConfirm({ type: 'one', session: s })}
              />
            )}
          />
        </div>

        {ended.length > 0 && (
          <div className="px-4 sm:px-8 py-4">
            <button
              type="button"
              onClick={() => setShowEnded((v) => !v)}
              className="text-xs text-brand-blue hover:underline"
            >
              {showEnded
                ? 'Hide signed-out sessions'
                : `Show ${ended.length} signed-out session${ended.length === 1 ? '' : 's'} (last 7 days)`}
            </button>
          </div>
        )}

        <footer className="bg-brand-blue h-10" />
      </section>

      {error && <ErrorInterface error={error} />}
      {notice && <p className="text-sm text-success">{notice}</p>}

      {confirm && (
        <div className="inset-0 z-50 flex justify-center items-center fixed bg-black bg-opacity-80">
          <WarningModal
            title={
              confirm.type === 'one'
                ? 'Unauthorize device'
                : 'Close all other sessions'
            }
            message={
              confirm.type === 'one'
                ? `Sign out ${confirm.session.browser} on ${confirm.session.os}?`
                : `Sign out all ${othersActive} other device${othersActive === 1 ? '' : 's'}?`
            }
            subText="They will need your password, and MFA again, to sign back in. Your current session stays signed in."
            onClick={runConfirmed}
            onClose={() => setConfirm(null)}
            button1Text="Yes, sign out"
            button2Text="Cancel"
            button1Style="bg-error text-white hover:bg-error-hover rounded-md px-4 py-2"
            button2Style="bg-gray-shadow5 text-text-black hover:bg-gray-shadow4 rounded-md px-4 py-2"
            loading={Boolean(busyId)}
            loadingText="Signing out..."
          />
        </div>
      )}
    </div>
  );
};

export default MySessions;
