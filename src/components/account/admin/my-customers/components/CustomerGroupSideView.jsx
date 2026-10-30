import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaSearch } from 'react-icons/fa';
import Spinner from '@/components/account/Spinner';
import Pagination from '@/components/account/Pagination';
import {
  fetchGroupMembersService,
  addGroupMembersService,
  removeGroupMembersService,
  deleteGroupService,
} from '@/services/customerServices';
import { fetchCustomersService } from '@/services/customerServices';
import { formatDate } from '@/utilities/formatTime';

const CustomerGroupSideView = ({
  group,
  onClose,
  onEdit,
  onDeleted,
  onChanged,
}) => {
  const [membersKey, setMembersKey] = useState(0); // bump to reload the member list
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [members, setMembers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticked, setTicked] = useState([]); // members ticked for removal

  const [showAdd, setShowAdd] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerApplied, setPickerApplied] = useState('');
  const [pickerPage, setPickerPage] = useState(1);
  const [picker, setPicker] = useState(null);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [picked, setPicked] = useState([]);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const groupBranchIds = group.isGlobal ? [] : group.branches.map((b) => b._id);

  // members
  useEffect(() => {
    const fetch = async () => {
      let cancelled = false;
      setLoading(true);
      await fetchGroupMembersService(group._id, {
        searchTerm: appliedSearch,
        page,
        limit: 15,
      }).then((res) => {
        if (cancelled) return;
        if (res.error) setMessage({ type: 'error', text: String(res.error) });
        else setMembers(res.data);
        setLoading(false);
      });
      return () => {
        cancelled = true;
      };
    };
    fetch();
  }, [group._id, appliedSearch, page, membersKey]);

  // customers to pick from (limited to the group's branches when it is a branch group)
  useEffect(() => {
    const fetch = async () => {
      if (!showAdd) return;
      let cancelled = false;
      setPickerLoading(true);
      fetchCustomersService({
        searchTerm: pickerApplied,
        branches: groupBranchIds,
        sortBy: 'name',
        page: pickerPage,
        limit: 10,
      }).then((res) => {
        if (cancelled) return;
        if (res.error) setMessage({ type: 'error', text: String(res.error) });
        else setPicker(res.data);
        setPickerLoading(false);
      });
      return () => {
        cancelled = true;
      };
    };
    fetch();
  }, [showAdd, pickerApplied, pickerPage, membersKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (setter) => (id) =>
    setter((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const addSelected = async () => {
    setBusy(true);
    setMessage({ type: '', text: '' });
    const res = await addGroupMembersService(group._id, picked);
    setBusy(false);
    if (res.error)
      return setMessage({ type: 'error', text: String(res.error) });
    setMessage({ type: 'ok', text: res.message });
    setPicked([]);
    setMembersKey((k) => k + 1);
    onChanged?.();
  };

  const removeSelected = async () => {
    setBusy(true);
    setMessage({ type: '', text: '' });
    const res = await removeGroupMembersService(group._id, ticked);
    setBusy(false);
    if (res.error)
      return setMessage({ type: 'error', text: String(res.error) });
    setMessage({ type: 'ok', text: res.message });
    setTicked([]);
    setMembersKey((k) => k + 1);
    onChanged?.();
  };

  const deleteGroup = async () => {
    setBusy(true);
    const res = await deleteGroupService(group._id);
    setBusy(false);
    if (res.error) {
      setConfirmDelete(false);
      return setMessage({ type: 'error', text: String(res.error) });
    }
    onDeleted?.();
  };

  const inGroup = (customer) =>
    customer.groups.some((g) => g._id === group._id);

  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      initial={{ x: '50%', y: '0%' }}
      animate={{ x: 0, y: 0 }}
      transition={{ duration: 0.75 }}
      className="relative w-1/2 h-full bg-text-white flex flex-col p-4 text-sm text-text-gray gap-3 overflow-y-auto"
    >
      <div className="absolute top-0 right-0 z-50 p-1 rounded-full text-brand-gray text-lg bg-brand-gray hover:bg-error cursor-pointer m-1">
        <FaTimes className="text-text-white" onClick={onClose} />
      </div>

      <div className="pr-8">
        <h3 className="text-lg font-semibold text-text-black">{group.name}</h3>
        {group.description && (
          <p className="whitespace-pre-wrap break-words">{group.description}</p>
        )}
        <p className="mt-1">
          {group.isGlobal ? (
            <span className="px-2 py-1 rounded-md bg-blue-shadow10">
              All branches
            </span>
          ) : (
            group.branches.map((b) => (
              <span
                key={b._id}
                className="mr-1 px-2 py-1 rounded-md bg-gray-shadow9"
              >
                {b.name}
              </span>
            ))
          )}
        </p>
        <p className="mt-1">
          {group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}{' '}
          you can see
          {group.createdBy?.fullName
            ? ` · Created by ${group.createdBy.fullName}`
            : ''}
        </p>
      </div>

      {group.canManage ? (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onEdit}
            className="py-1 px-3 rounded-lg border border-gray-border"
          >
            Edit group
          </button>
          {confirmDelete ? (
            <span className="flex items-center gap-2">
              Delete this group?
              <button
                onClick={deleteGroup}
                disabled={busy}
                className="py-1 px-3 rounded-lg bg-error text-text-white disabled:opacity-50"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="py-1 px-3 rounded-lg border border-gray-border"
              >
                No
              </button>
            </span>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="py-1 px-3 rounded-lg border border-error text-error"
            >
              Delete group
            </button>
          )}
        </div>
      ) : (
        <p className="italic">You can view this group but not change it.</p>
      )}

      {message.text && (
        <p
          className={message.type === 'error' ? 'text-error' : 'text-green-600'}
        >
          {message.text}
        </p>
      )}
      <hr></hr>

      {/* ---- members ---- */}
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-semibold text-text-black">Members</h4>
        <div className="h-8 px-2 border border-gray-border rounded-md flex items-center flex-1 max-w-xs">
          <FaSearch aria-hidden="true" />
          <input
            type="text"
            placeholder="Search members"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setAppliedSearch(search);
                setPage(1);
              }
            }}
            className="focus:outline-none ml-2 w-full"
          />
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-shadow10">
                {group.canManage && <th className="px-2 py-2 w-8"></th>}
                <th className="px-2 py-2">Customer</th>
                <th className="px-2 py-2">Registered at</th>
                <th className="px-2 py-2">Last visit</th>
              </tr>
            </thead>
            <tbody>
              {members?.members?.length ? (
                members.members.map((m) => (
                  <tr key={m._id} className="border-b border-gray-border">
                    {group.canManage && (
                      <td className="px-2 py-2">
                        <input
                          type="checkbox"
                          checked={ticked.includes(m._id)}
                          onChange={() => toggle(setTicked)(m._id)}
                          aria-label={`Select ${m.name}`}
                        />
                      </td>
                    )}
                    <td className="px-2 py-2">
                      <span className="block text-text-black">{m.name}</span>
                      <span className="text-xs">{m.customerNumber}</span>
                    </td>
                    <td className="px-2 py-2">
                      {m.registeredBranch?.name || 'N/A'}
                    </td>
                    <td className="px-2 py-2">
                      {m.lastVisited
                        ? formatDate(new Date(m.lastVisited))
                        : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-2 py-6 text-center italic" colSpan={4}>
                    No members yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {members?.pagination && (
            <Pagination
              currentPage={page}
              totalPages={members.pagination.totalPages || 1}
              onPageChange={setPage}
            />
          )}
          {group.canManage && ticked.length > 0 && (
            <button
              onClick={removeSelected}
              disabled={busy}
              className="w-fit py-1 px-3 rounded-lg border border-error text-error disabled:opacity-50"
            >
              Remove {ticked.length} selected
            </button>
          )}
        </>
      )}

      {/* ---- add customers ---- */}
      {group.canManage && (
        <>
          <hr></hr>
          <button
            onClick={() => setShowAdd((s) => !s)}
            className="w-fit py-1 px-3 rounded-lg bg-brand-blue text-text-white"
          >
            {showAdd ? 'Hide customer picker' : 'Add customers'}
          </button>

          {showAdd && (
            <div className="flex flex-col gap-2 border border-gray-border rounded-md p-2">
              <p className="text-xs">
                {group.isGlobal
                  ? 'Any customer you can see can be added.'
                  : 'Only customers from this group’s branches can be added.'}
              </p>
              <div className="h-8 px-2 border border-gray-border rounded-md flex items-center">
                <FaSearch aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search by name or customer number, then press Enter"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setPickerApplied(pickerSearch);
                      setPickerPage(1);
                    }
                  }}
                  className="focus:outline-none ml-2 w-full"
                />
              </div>

              {pickerLoading ? (
                <Spinner />
              ) : (
                <table className="w-full text-left">
                  <tbody>
                    {picker?.customers?.length ? (
                      picker.customers.map((c) => {
                        const already = inGroup(c);
                        return (
                          <tr
                            key={c._id}
                            className="border-b border-gray-border"
                          >
                            <td className="px-2 py-2 w-8">
                              <input
                                type="checkbox"
                                disabled={already}
                                checked={already || picked.includes(c._id)}
                                onChange={() => toggle(setPicked)(c._id)}
                                aria-label={`Select ${c.name}`}
                              />
                            </td>
                            <td className="px-2 py-2">
                              <span className="block text-text-black">
                                {c.name}
                              </span>
                              <span className="text-xs">
                                {c.customerNumber}
                              </span>
                            </td>
                            <td className="px-2 py-2">
                              {c.registeredBranch?.name || 'N/A'}
                            </td>
                            <td className="px-2 py-2 text-xs">
                              {already ? 'In group' : ''}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="px-2 py-4 text-center italic">
                          No customers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {picker?.pagination && (
                <Pagination
                  currentPage={pickerPage}
                  totalPages={picker.pagination.totalPages || 1}
                  onPageChange={setPickerPage}
                />
              )}
              <button
                onClick={addSelected}
                disabled={busy || picked.length === 0}
                className="w-fit py-1 px-3 rounded-lg bg-brand-blue text-text-white disabled:opacity-50"
              >
                Add {picked.length || ''} selected
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default CustomerGroupSideView;
