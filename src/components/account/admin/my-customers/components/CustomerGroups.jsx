import Header from '@/components/account/AdminHeader';
import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import SubHeader from '../../SubHeader';
import SideBar from '../../SideBar';
import MY_CUSTOMER_SUBMENUS from './MY_CUSTOMER_SUBMENUS';
import PageDescription from '@/components/account/PageDescription';
import Spinner from '@/components/account/Spinner';
import ErrorModal from '@/components/account/ErrorModal';
import {
  fetchGroupsService,
  fetchGroupBranchOptionsService,
} from '@/services/customerServices';
import { formatDate } from '@/utilities/formatTime';
import CustomerGroupFormModal from './CustomerGroupFormModal';
import CustomerGroupSideView from './CustomerGroupSideView';

const CustomerGroups = ({ pageDescription }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [groups, setGroups] = useState([]);
  const [permissions, setPermissions] = useState({
    canCreate: false,
    canCreateGlobal: false,
  });
  const [branchOptions, setBranchOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [form, setForm] = useState(null); // null | { group } (group null = create)
  const [errorMessage, setErrorMessage] = useState(null);

  // the open group is read from the fresh list, so counts and edits stay current
  const selectedGroup = groups.find((g) => g._id === selectedGroupId) || null;
  console.log('branch options----', branchOptions);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let cancelled = false;
    fetchGroupBranchOptionsService().then((res) => {
      if (!cancelled && res.data) setBranchOptions(res.data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const res = await fetchGroupsService();
      if (cancelled) return;
      if (res.error) {
        setErrorMessage(String(res.error));
        setGroups([]);
      } else {
        setGroups(res.data?.groups || []);
        setPermissions(
          res.data?.permissions || { canCreate: false, canCreateGlobal: false }
        );
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const visible = groups.filter((g) =>
    g.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader title={'Customer Groups'} />
      </div>
      <div className="flex flex-row gap-0 w-full h-full relative">
        <div className="min-w-fit absolute left-0 top-0 z-50">
          <SideBar
            selectedSubMenu="customer-groups"
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
            sideBarSubmenus={MY_CUSTOMER_SUBMENUS}
          />
        </div>
        <div className="flex flex-col h-full w-full relative">
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-full flex flex-col gap-5">
            <div className="flex flex-row justify-between items-center gap-3">
              <div className="h-8 px-3 border border-gray-border rounded-md flex flex-row items-center w-1/3 text-sm">
                <FaSearch aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search groups"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="focus:outline-none ml-2 w-full"
                />
              </div>
              {permissions.canCreate && (
                <button
                  onClick={() => setForm({ group: null })}
                  className="px-3 py-1 text-sm shadow-md bg-blue-shadow1 text-text-white rounded-md hover:bg-brand-blue whitespace-nowrap"
                >
                  Create group
                </button>
              )}
            </div>

            {loading ? (
              <Spinner />
            ) : (
              <div className="max-h-[70vh] overflow-y-auto scrollbar-thin">
                <table className="w-full">
                  <thead className="sticky top-0 bg-white">
                    <tr className="text-left bg-gray-shadow10 text-sm text-text-gray">
                      <th className="px-4 py-4 border border-gray-shadow8">
                        Group
                      </th>
                      <th className="px-4 py-4 border border-gray-shadow8">
                        Branches
                      </th>
                      <th className="px-4 py-4 text-center border border-gray-shadow8">
                        Members
                      </th>
                      <th className="px-4 py-4 text-center border border-gray-shadow8">
                        Created by
                      </th>
                      <th className="px-4 py-4 text-center border border-gray-shadow8">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-text-gray">
                    {visible.length > 0 ? (
                      visible.map((g) => (
                        <tr
                          key={g._id}
                          onClick={() => setSelectedGroupId(g._id)}
                          className="border-b border-gray-border text-sm cursor-pointer hover:bg-gray-shadow10"
                        >
                          <td className="px-4 py-3">
                            <span className="block text-text-black">
                              {g.name}
                            </span>
                            {g.description && (
                              <span className="text-xs">{g.description}</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {g.isGlobal ? (
                              <span className="px-2 py-1 rounded-md bg-blue-shadow10">
                                All branches
                              </span>
                            ) : (
                              g.branches.map((b) => b.name).join(', ')
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {g.memberCount}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {g.createdBy?.fullName || '-'}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {g.createdAt
                              ? formatDate(new Date(g.createdAt))
                              : '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="text-center text-text-gray h-[40vh]">
                        <td className="font-semibold" colSpan={5}>
                          {groups.length
                            ? 'No groups match your search.'
                            : 'No customer groups yet.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="sticky bottom-0">
            <PageDescription pageDescription={pageDescription} />
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="inset-0 fixed bg-black bg-opacity-50 z-[70] flex justify-center items-center">
          <ErrorModal
            message={errorMessage}
            title={'Error'}
            buttonStyle={'bg-error'}
            onClose={() => setErrorMessage(null)}
            buttonText={'Close'}
            subText={'Please try again'}
          />
        </div>
      )}

      {selectedGroup && (
        <div
          className="inset-0 fixed bg-black bg-opacity-50 z-50 flex justify-end items-center"
          onClick={() => setSelectedGroupId(null)}
        >
          <CustomerGroupSideView
            key={selectedGroup._id}
            group={selectedGroup}
            onClose={() => setSelectedGroupId(null)}
            onEdit={() => setForm({ group: selectedGroup })}
            onDeleted={() => {
              setSelectedGroupId(null);
              reload();
            }}
            onChanged={reload}
          />
        </div>
      )}

      {form && (
        <div className="inset-0 fixed bg-black bg-opacity-50 z-[60] flex justify-center items-center">
          <CustomerGroupFormModal
            group={form.group}
            branchOptions={branchOptions}
            canCreateGlobal={permissions.canCreateGlobal}
            onClose={() => setForm(null)}
            onSaved={(saved) => {
              setForm(null);
              if (!form.group && saved) setSelectedGroupId(saved._id); // open a new group to add members
              reload();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CustomerGroups;
