import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import Spinner from '@/components/account/Spinner';
import Button from '@/components/account/Button';
import ErrorInterface from '@/components/account/errorInterface';
import WarningModal from '@/components/account/WarningModal';
import { useCompanyData } from '@/contexts/companyDataContext';
import {
  getTrustedDevicesService,
  revokeTrustedDeviceService,
  updateTrustedDeviceService,
} from '@/services/trustedDeviceServices';
import DeviceFilters from './DeviceFilters';
import { deviceColumns, DeviceActions } from './DeviceRow';
import EditDeviceModal from './EditDeviceModal';
import ResponsiveTable from '@/components/account/admin/ui/ResponsiveTable';

const time = (value) => (value ? new Date(value).getTime() : 0);

const SORTERS = {
  newest: (a, b) => time(b.createdAt) - time(a.createdAt),
  oldest: (a, b) => time(a.createdAt) - time(b.createdAt),
  last_used: (a, b) => time(b.lastUsedAt) - time(a.lastUsedAt),
  least_used: (a, b) => time(a.lastUsedAt) - time(b.lastUsedAt),
};

// Devices authorized to access the company (splash, sales point, manager login).
const DeviceAuthorizations = () => {
  const { companyData } = useCompanyData();
  const deviceToken = companyData?.authorizationToken;
  const [result, setResult] = useState(null); // { data, filters, canManage }
  const [loadError, setLoadError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    branch: '',
    addedBy: '',
    sort: 'newest',
  });
  const [editing, setEditing] = useState(null);
  const [revoking, setRevoking] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null); // shown in the open modal
  const [notice, setNotice] = useState(null);

  const load = useCallback(async () => {
    setLoadError(null);
    const response = await getTrustedDevicesService(deviceToken);
    if (response.error) setLoadError(response.error);
    else setResult(response.data);
  }, [deviceToken]);

  useEffect(() => {
    load();
  }, [load]);

  const devices = useMemo(() => {
    if (!result) return [];
    const search = filters.search.trim().toLowerCase();
    return result.data
      .filter((d) => !search || d.deviceName.toLowerCase().includes(search))
      .filter(
        (d) =>
          !filters.branch ||
          d.allBranches ||
          d.branches.some((b) => String(b._id) === filters.branch)
      )
      .filter(
        (d) => !filters.addedBy || String(d.addedBy?._id) === filters.addedBy
      )
      .sort(SORTERS[filters.sort] || SORTERS.newest);
  }, [result, filters]);

  const runAction = async (fn, onDone) => {
    setBusy(true);
    setError(null);
    try {
      const response = await fn();
      if (response.error) return setError(response.error);
      setNotice(response.data.message);
      onDone();
      return load();
    } finally {
      setBusy(false);
    }
  };

  const closeModals = () => {
    setEditing(null);
    setRevoking(null);
    setError(null);
  };

  if (!result) {
    return loadError ? (
      <div className="flex flex-col items-center gap-3 py-10">
        <ErrorInterface error={loadError} />
        <Button onClick={load} text="Try again" buttonStyle="px-5" />
      </div>
    ) : (
      <Spinner />
    );
  }

  return (
    <div className="flex flex-col gap-4 text-text-gray w-full">
      <div className="sticky top-0 bg-text-white z-30">
        <section className="flex flex-row gap-3 border-b border-gray-border pb-4">
          <FaShieldAlt className="text-2xl mt-1 text-brand-blue" />
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-text-black">
              Device authorization
            </h2>
            <p className="text-sm">
              {result.data.length} device
              {result.data.length === 1 ? ' is' : 's are'} authorized to access
              your company. Revoking a device stops the sales point and staff
              logins on it the next time it connects.
              {!result.canManage &&
                ' You need IT Management access to edit or revoke devices.'}
            </p>
          </div>
        </section>

        <DeviceFilters
          filters={filters}
          setFilters={setFilters}
          branches={result.filters.branches}
          addedByOptions={result.filters.addedBy}
          shown={devices.length}
          total={result.data.length}
        />
      </div>

      {notice && <p className="text-sm text-success">{notice}</p>}

      <section className="flex flex-col rounded-lg overflow-hidden shadow-md bg-white">
        <h3 className="bg-brand-blue text-text-white text-center text-lg py-3">
          Authorized Devices
        </h3>
        {/* md and up: fixed height, the table scrolls inside and the header row stays visible */}
        <div className="md:h-[55vh] md:min-h-[280px] px-3 sm:px-6 py-3 md:py-0">
          <ResponsiveTable
            align="left"
            maxHeightClass="md:h-full"
            rows={devices}
            emptyMessage={
              result.data.length
                ? 'No devices match your filters.'
                : 'No authorized devices yet.'
            }
            columns={deviceColumns}
            actionsHeader="Action"
            actions={(device) => (
              <DeviceActions
                device={device}
                canManage={result.canManage}
                busy={busy && revoking?._id === device._id}
                onEdit={setEditing}
                onRevoke={setRevoking}
              />
            )}
          />
        </div>
        <footer className="bg-brand-blue h-10" />
      </section>

      {editing && (
        <EditDeviceModal
          device={editing}
          branches={result.filters.branches}
          saving={busy}
          error={error}
          onClose={closeModals}
          onSave={(body) =>
            runAction(
              () => updateTrustedDeviceService(editing._id, body),
              closeModals
            )
          }
        />
      )}

      {revoking && (
        <div className="inset-0 z-50 flex justify-center items-center fixed bg-black bg-opacity-80">
          <WarningModal
            title="Revoke device"
            message={`Revoke access for "${revoking.deviceName}"?`}
            subText={
              revoking.isCurrent
                ? 'This is the device you are using now. It will lose access to the sales point and staff logins.'
                : error ||
                  'The sales point and staff logins on this device will stop working. It can be authorized again later.'
            }
            onClick={() =>
              runAction(
                () => revokeTrustedDeviceService(revoking._id),
                closeModals
              )
            }
            onClose={closeModals}
            button1Text="Yes, revoke"
            button2Text="Cancel"
            button1Style="bg-error text-white hover:bg-error-hover rounded-md px-4 py-2"
            button2Style="bg-gray-shadow5 text-text-black hover:bg-gray-shadow4 rounded-md px-4 py-2"
            loading={busy}
            loadingText="Revoking..."
          />
        </div>
      )}
    </div>
  );
};

export default DeviceAuthorizations;
