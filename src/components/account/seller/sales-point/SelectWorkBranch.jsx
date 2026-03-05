import React from 'react';
import Button from '../../Button';

const SelectWorkBranch = ({
  branchesAccessibleOnDevice,
  handleWorkBranchSelect,
  logOutSalesPoint,
  style,
}) => {
  const [selectedBranch, setSelectedBranch] = React.useState(null);

  const handleBranchSelect = (branchID) => {
    const branch = branchesAccessibleOnDevice?.find(
      (branch) => branch._id === branchID
    );
    setSelectedBranch(branch);
  };

  return (
    <div
      className={`rounded-lg shadow-lg flex flex-col w-1/3 h-1/2 overflow-y-auto no-scrollbar  ${style}`}
    >
      <h3 className="text-base mb-4 bg-brand-green w-full py-4 rounded-t-lg text-center font-semibold">
        Select your work Branch
      </h3>
      {/* Branch List */}
      <ul className="border border-border-gray rounded-md p-1 w-full max-h-[70%] overflow-y-auto scrollbar-thin">
        {branchesAccessibleOnDevice?.map((branch) => (
          <li
            key={branch._id}
            onClick={() => handleBranchSelect(branch._id)}
            className={`cursor-pointer p-2 mb-2 rounded-md hover:bg-gray-shadow7 ${
              selectedBranch && selectedBranch._id === branch._id
                ? 'bg-green-shadow3 font-semibold'
                : ''
            }`}
          >
            {branch.name}
          </li>
        ))}
      </ul>

      {/* Enter and back buttons */}
      <div className="flex justify-between my-2 px-4">
        <Button
          text="Logout"
          onClick={logOutSalesPoint}
          type="secondary"
          buttonStyle="px-4 py-2 shadow-sm"
        />

        <Button
          text="Enter"
          onClick={() => handleWorkBranchSelect(selectedBranch)}
          type="primary"
          buttonStyle="px-4 py-2 shadow-sm bg-brand-green text-white hover:bg-green-700"
          disabled={!selectedBranch}
        />
      </div>
    </div>
  );
};

export default SelectWorkBranch;
