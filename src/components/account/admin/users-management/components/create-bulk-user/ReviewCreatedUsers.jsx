import ExportContent from '@/components/account/common/ExportContent';
import React from 'react';
import { PhoneNumber } from 'react-phone-number-input';
import ResponsiveTable from '@/components/account/admin/ui/ResponsiveTable';

const ReviewCreatedUsers = ({
  newUsers,
  existingUsers,
  usersWithErrors,
  onClose,
}) => {
  const [dataToView, setDataToView] = React.useState(null);

  return (
    <>
      {dataToView && dataToView.length > 0 ? (
        <div>
          <ExportContent
            data={dataToView.map((user) => ({
              Staff_ID: user.staffId,
              Full_Name: user.fullName,
              Email: user.email,
              Role: user.role,
              Branches: user.branch.map((brnch) => brnch.name)?.join(', '),
              Phone_Number: user.phoneNumber,
            }))}
            onClose={() => setDataToView(null)}
            title={`Users ${
              dataToView === newUsers
                ? 'Created'
                : dataToView === existingUsers
                  ? 'Already Existing'
                  : ' Users with Error'
            } (${dataToView.length})`}
            metadata={''}
          />
        </div>
      ) : (
        <div className="bg-text-white rounded-lg max-w-[600px] min-h-[60vh] w-[calc(100%-1rem)] flex flex-col items-center gap-4 pb-4">
          <h2 className="bg-brand-blue w-full text-center py-2 text-text-white rounded-t-lg">
            Review Created Users
          </h2>
          <span className="px-4 text-center">
            some of the users you uploaded were not created. please review them
          </span>

          <div className="w-full px-3">
            <ResponsiveTable
              className="w-full my-6 md:my-10"
              layout="table"
              align="left"
              dense
              maxHeightClass=""
              getRowKey={(r) => r.label}
              rows={[
                { label: 'New users created', users: newUsers },
                { label: 'Users already existing', users: existingUsers },
                {
                  label: 'Users with error (not created)',
                  users: usersWithErrors,
                },
              ]}
              columns={[
                { key: 'label', header: 'Result', cell: (r) => r.label },
                {
                  key: 'count',
                  header: 'Users',
                  align: 'center',
                  cellClass: () => 'font-semibold',
                  cell: (r) => r.users?.length || 0,
                },
              ]}
              actionsHeader=""
              actions={(r) => (
                <button
                  type="button"
                  className="text-sm font-semibold hover:underline text-text-blue whitespace-nowrap px-1"
                  onClick={() => setDataToView(r.users)}
                >
                  View Users
                </button>
              )}
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <button
              className="bg-brand-blue text-text-white px-4 py-2 rounded-lg hover:bg-brand-blue-dark"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewCreatedUsers;
