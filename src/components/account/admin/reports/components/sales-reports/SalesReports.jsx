import Header from '@/components/account/admin/AdminHeader';
import React, { useCallback, useState } from 'react';
import SubHeader from '../../../SubHeader';
import SideBar from '../../../SideBar';
import ExportContent from '@/components/account/ExportContent';
import { REPORTS_SUBMENUS } from '../REPORTS_SUBMENUS';
import { FaChartLine, FaLightbulb, FaTools } from 'react-icons/fa';
import { SALES_REPORT_NAVS } from './SALES_REPORT_NAVIGATIONS';
import SalesReportFilters from './SalesReportFilters';
import { presetRange } from '../DateRangeButton';
import PageDescription from '@/components/account/PageDescription';

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
              onExport={() => setShowExport(true)}
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
        <div className="inset-0 fixed bg-black bg-opacity-60 z-[80] flex justify-center items-center">
          <ExportContent
            title={`Export ${loaded.export.title}`}
            fileName={loaded.export.fileName}
            metadata={loaded.export.metadata}
            data={loaded.export.data}
            onClose={() => setShowExport(false)}
          />
        </div>
      )}
    </div>
  );
};

export default SalesReports;

const Logo = () => {
  return <FaChartLine className="mx-1 text-text-gray" />;
};
