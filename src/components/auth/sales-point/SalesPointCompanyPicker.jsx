'use client';
import React from 'react';
import { FaBuilding } from 'react-icons/fa';
import { useCompanyData } from '@/contexts/companyDataContext';
import {
  checkDeviceAuthorizationService,
  deviceCompaniesService,
} from '@/services/authServices';
import {
  readDeviceCompanies,
  replaceDeviceCompanies,
} from '@/utilities/deviceCompanies';

/*
  Which company the sales point logs in to, shown only when this device is authorized by more than
  one. Staff IDs are only unique inside a company, so the sales point always logs in to the
  company in use (companyData); picking another one switches the device to it, with its branches.
  Offline, the branches stored when the company was last used are taken.
*/
const SalesPointCompanyPicker = ({ className = '' }) => {
  const { companyData, setCompanyData } = useCompanyData();
  const [companies, setCompanies] = React.useState([]);
  const [switching, setSwitching] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const stored = readDeviceCompanies();
    setCompanies(stored);
    if (stored.length < 2 || !navigator.onLine) return undefined;
    let current = true;
    // drop the companies that no longer trust this device
    deviceCompaniesService(stored).then((res) => {
      if (!current || !res.data) return;
      replaceDeviceCompanies(res.data);
      setCompanies(readDeviceCompanies());
    });
    return () => {
      current = false;
    };
  }, []);

  if (companies.length < 2) return null;

  const pick = async (id) => {
    const entry = companies.find((c) => String(c.id) === String(id));
    if (!entry || String(id) === String(companyData?.id)) return;
    setError(null);
    setSwitching(true);
    try {
      const res = navigator.onLine
        ? await checkDeviceAuthorizationService({
            companyId: entry.id,
            authorizationToken: entry.authorizationToken,
          })
        : { offline: true };
      if (res.data) {
        setCompanyData({ ...res.data, name: res.data.name || entry.name });
      } else if (res.unauthorized) {
        // revoked by that company: take it off the list
        const rest = companies.filter((c) => c.id !== entry.id);
        replaceDeviceCompanies(rest);
        setCompanies(rest);
        setError(`This device is no longer authorized by ${entry.name}.`);
      } else {
        // offline or no answer: use what was stored for that company
        setCompanyData({
          id: entry.id,
          name: entry.name,
          authorizationToken: entry.authorizationToken,
          allowedBranches: entry.allowedBranches || [],
        });
      }
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      <label
        htmlFor="sales-point-company"
        className="flex items-center gap-2 text-sm font-semibold text-text-black"
      >
        <FaBuilding className="text-brand-green" /> Company
      </label>
      <select
        id="sales-point-company"
        value={String(companyData?.id || '')}
        disabled={switching}
        onChange={(e) => pick(e.target.value)}
        className="w-full h-10 rounded-md border border-brand-green bg-white px-3 text-base text-text-black disabled:opacity-60"
      >
        {!companies.some((c) => String(c.id) === String(companyData?.id)) && (
          <option value="">Choose a company</option>
        )}
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name || 'Company'}
          </option>
        ))}
      </select>
      <span className="text-xs text-text-gray leading-snug">
        {switching
          ? 'Switching…'
          : 'This device is authorized by more than one company. Staff log in to the one chosen here.'}
      </span>
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
};

export default SalesPointCompanyPicker;
