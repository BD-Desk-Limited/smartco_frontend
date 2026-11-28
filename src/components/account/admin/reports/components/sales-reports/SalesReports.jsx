import Header from '@/components/account/admin/shell/AdminHeader';
import React, { useCallback, useState } from 'react';
import SubHeader from '../../../shell/SubHeader';
import SideBar from '../../../shell/SideBar';
import ExportContent from '@/components/account/common/ExportContent';
import { REPORTS_SUBMENUS } from '../REPORTS_SUBMENUS';
import { FaChartLine, FaLightbulb, FaTools } from 'react-icons/fa';
import { SALES_REPORT_NAVS } from './SALES_REPORT_NAVIGATIONS';
import SalesReportFilters from './SalesReportFilters';
import { presetRange } from '../DateRangeButton';
import PageDescription from '@/components/account/common/PageDescription';

const SalesReports = ({ pageDescription }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [selectedNav, setSelectedNav] = useState(SALES_REPORT_NAVS[0].name);
  // shared by every tab, so switching tabs keeps the same period, branches and comparison.
  // Starts on today, all branches, no comparison.
  const [filters, setFilters] = useState(() => ({
    ...presetRange('today'),
    branchIds: [],
    compare: null, // { from, to } once a comparison is chosen in the Compare window
  }));
  const [branches, setBranches] = useState([]);
  const [loaded, setLoaded] = useState(null); // { insight, export } from the active tab
  const [showExport, setShowExport] = useState(false);
  // rows of an export that loads them when opened ({ load }), e.g. every page of a paged list
  const [exportRows, setExportRows] = useState({
    status: 'idle',
    data: null,
    error: null,
  });

  const openExport = async () => {
    const load = loaded?.export?.load;
    setShowExport(true);
    if (!load) return;
    setExportRows({ status: 'loading', data: null, error: null });
    try {
      setExportRows({ status: 'done', data: await load(), error: null });
    } catch (e) {
      setExportRows({
        status: 'error',
        data: null,
        error: e.message || 'Could not load the rows to export',
      });
    }
  };
  const closeExport = () => {
    setShowExport(false);
    setExportRows({ status: 'idle', data: null, error: null });
  };

  const handleLoaded = useCallback(({ branches: list, ...rest }) => {
    if (list) setBranches(list);
    setLoaded(rest);
  }, []);

  const selectTab = (name) => {
    setSelectedNav(name);
    setLoaded(null);
  };

  const activeNav = SALES_REPORT_NAVS.find((n) => n.name === selectedNav);
  const ActiveReport = activeNav.component;

  return (
    <div className="h-full overflow-y-auto w-full">
      <div className="w-full sticky top-0 z-[60]">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader
          FirstComponents={<Logo />}
          title={`Reports · ${activeNav.label}`}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-0 w-full h-full relative">
        <div className="min-w-fit md:absolute md:left-0 md:top-0 md:z-50">
          <SideBar
            selectedSubMenu="sales-performance"
            sideBarSubmenus={REPORTS_SUBMENUS}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className="flex flex-col relative h-full w-full">
          <div className="bg-text-white shadow-md gap-3 min-w-0 md:sticky md:top-14 z-[40]">
            <SalesReportFilters
              filters={filters}
              setFilters={setFilters}
              branches={branches}
              canExport={Boolean(loaded?.export)}
              onExport={openExport}
            />

            {/* Tabs: one report per tab */}
            <nav
              aria-label="Sales reports"
              className="bg-white rounded-xl px-2 md:px-4 py-2 md:py-3 flex flex-row flex-nowrap md:flex-wrap justify-start md:justify-center gap-x-2 gap-y-1 overflow-x-auto no-scrollbar"
            >
              {SALES_REPORT_NAVS.map((nav) => (
                <button
                  key={nav.name}
                  type="button"
                  onClick={() => selectTab(nav.name)}
                  aria-current={nav.name === selectedNav ? 'page' : undefined}
                  className={`px-3 py-2 rounded-xl text-sm whitespace-nowrap shrink-0 transition-colors ${
                    nav.name === selectedNav
                      ? 'text-brand-green bg-green-shadow7 font-semibold'
                      : nav.ready
                        ? 'text-text-black hover:bg-gray-shadow10'
                        : 'text-text-gray hover:bg-gray-shadow10'
                  } hover:bg-green-shadow8`}
                >
                  {nav.label}
                </button>
              ))}
            </nav>
          </div>

          {ActiveReport ? (
            <ActiveReport filters={filters} onLoaded={handleLoaded} />
          ) : (
            <div className="bg-white rounded-xl py-16 flex flex-col items-center gap-2 text-text-gray">
              <FaTools className="text-2xl" />
              <p className="text-sm">{activeNav.label} is coming soon.</p>
            </div>
          )}
          <PageDescription
            pageDescription={loaded?.insight || pageDescription}
          />
        </div>
      </div>

      {showExport && loaded?.export && (
        <div
          className="inset-0 fixed bg-black bg-opacity-60 z-[80] flex justify-center items-center"
          onClick={
            exportRows.status === 'done' || !loaded.export.load
              ? undefined
              : closeExport
          }
        >
          {loaded.export.load && exportRows.status !== 'done' ? (
            <div
              className="bg-white rounded-lg shadow-lg p-6 mx-4 flex flex-col items-center gap-3 text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {exportRows.status === 'error' ? (
                <>
                  <p className="text-error">{exportRows.error}</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={openExport}
                      className="text-brand-blue hover:underline"
                    >
                      Try again
                    </button>
                    <button
                      type="button"
                      onClick={closeExport}
                      className="text-text-gray hover:underline"
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <p>Preparing the export…</p>
              )}
            </div>
          ) : (
            <ExportContent
              title={`Export ${loaded.export.title}`}
              fileName={loaded.export.fileName}
              metadata={loaded.export.metadata}
              data={loaded.export.load ? exportRows.data : loaded.export.data}
              onClose={closeExport}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SalesReports;

const Logo = () => {
  return <FaChartLine className="mx-1 text-text-gray" />;
};
