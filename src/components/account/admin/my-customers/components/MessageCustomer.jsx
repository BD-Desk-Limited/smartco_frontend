import Header from '@/components/account/AdminHeader';
import React, { useCallback, useEffect, useState } from 'react';
import SubHeader from '../../SubHeader';
import SideBar from '../../SideBar';
import MY_CUSTOMER_SUBMENUS from './MY_CUSTOMER_SUBMENUS';
import PageDescription from '@/components/account/PageDescription';
import Spinner from '@/components/account/Spinner';
import { fetchComposeOptionsService } from '@/services/customerServices';
import MessageTemplates from './MessageTemplates';
import MessageHistory from './MessageHistory';
import MessageComposer from './MessageComposer';

const TABS = [
  { value: 'compose', label: 'New message' },
  { value: 'history', label: 'Sent messages' },
  { value: 'templates', label: 'Templates' },
];

const CustomerMessages = ({ pageDescription }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [tab, setTab] = useState('compose');
  const [options, setOptions] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [openCampaignId, setOpenCampaignId] = useState(null);
  const [composerKey, setComposerKey] = useState(0); // a fresh composer after every send

  const loadOptions = useCallback(async () => {
    const res = await fetchComposeOptionsService();
    if (res.error) setError(String(res.error));
    else {
      setError('');
      setOptions(res.data);
    }
  }, []);
  useEffect(() => {
    let active = true;

    fetchComposeOptionsService().then((res) => {
      if (!active) return;
      if (res.error) setError(String(res.error));
      else {
        setError('');
        setOptions(res.data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const handleSent = (campaign, message) => {
    setNotice(message || 'Your message is being sent...');
    setOpenCampaignId(campaign._id);
    setComposerKey((k) => k + 1);
    setTab('history');
  };

  return (
    <div>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader title={'Messages'} />
      </div>
      <div className="flex flex-row gap-0 w-full h-full relative">
        <div className="min-w-fit absolute left-0 top-0 z-50">
          <SideBar
            selectedSubMenu="customer-messages"
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
            sideBarSubmenus={MY_CUSTOMER_SUBMENUS}
          />
        </div>
        <div className="flex flex-col h-full w-full relative">
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-full flex flex-col gap-4">
            <div
              className="flex gap-1 border-b border-gray-border"
              role="tablist"
            >
              {TABS.map((t) => (
                <button
                  key={t.value}
                  role="tab"
                  aria-selected={tab === t.value}
                  onClick={() => {
                    setTab(t.value);
                    setNotice('');
                  }}
                  className={`px-4 py-2 text-sm ${
                    tab === t.value
                      ? 'border-b-2 border-brand-blue text-brand-blue font-semibold'
                      : 'text-text-gray'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {notice && <p className="text-sm text-green-600">{notice}</p>}
            {error && <p className="text-sm text-error">{error}</p>}

            {!options && !error ? (
              <Spinner />
            ) : (
              options && (
                <>
                  {tab === 'compose' && (
                    <MessageComposer
                      key={composerKey}
                      options={options}
                      onSent={handleSent}
                    />
                  )}
                  {tab === 'history' && (
                    <MessageHistory
                      isAdmin={options.permissions.isAdmin}
                      openCampaignId={openCampaignId}
                      onOpened={() => setOpenCampaignId(null)}
                    />
                  )}
                  {tab === 'templates' && (
                    <MessageTemplates
                      canManage={options.permissions.canManageTemplates}
                      placeholders={options.placeholders}
                      onChanged={loadOptions}
                    />
                  )}
                </>
              )
            )}
          </div>
          <div className="sticky bottom-0">
            <PageDescription pageDescription={pageDescription} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerMessages;
