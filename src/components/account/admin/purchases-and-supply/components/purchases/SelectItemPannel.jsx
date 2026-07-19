import { useEffect, useState } from 'react';
import { FaBoxes, FaSearch, FaTimes } from 'react-icons/fa';
import EnterQuantityPannel from './EnterQuantityPannel';

const SelectItemPannel = ({
  onCloseSelectItemPannel,
  materials,
  onChangePurchaseRecord,
  purchaseRecord,
  selectedMaterial,
  setSelectedMaterial,
  openEnterQuantityPannel,
  setOpenEnterQuantityPannel,
}) => {
  const [filterTerm, setFilterTerm] = useState('');
  const [filteredMaterials, setFilteredMaterials] = useState([]);

  useEffect(() => {
    const handleFilter = () => {
      if (filterTerm.trim() === '') {
        setFilteredMaterials(materials);
      } else {
        const filtered = materials?.filter((material) =>
          material.name.toLowerCase().includes(filterTerm.toLowerCase())
        );
        setFilteredMaterials(filtered);
      }
    };

    handleFilter();
  }, [filterTerm, materials]);

  const onMaterialClick = (material) => {
    const updatedMaterial = {
      ...material,
      unitOfMeasurement: material.unitOfMeasurement?.name || '',
    };

    setSelectedMaterial(updatedMaterial);
    setOpenEnterQuantityPannel(true);
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="bg-white w-[80%] h-[90%] rounded-lg p-5 relative"
    >
      {/* Close button */}
      <span
        onClick={onCloseSelectItemPannel}
        title="close"
        className="absolute top-0 right-0 p-2 rounded-full bg-gray-shadow5 hover:bg-error-hover cursor-pointer"
      >
        <FaTimes className="text-text-white" />
      </span>

      {/* search bar */}
      <div className="h-8 px-3 border-2 border-gray-border rounded-md flex flex-row items-center w-full">
        <FaSearch className="text-text-gray" />
        <input
          type="text"
          placeholder="Search items purchased"
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.target.value)}
          className="focus:outline-none ml-2 w-full font-semibold"
        />
      </div>

      <div className="flex flex-col h-full w-full">
        <span className="my-1 text-sm">Select Item purchased:</span>

        <div className="flex flex-row items-center justify-center p-3 rounded-md cursor-pointer h-full w-full">
          {/* list of materials */}
          {filteredMaterials && filteredMaterials?.length > 0 ? (
            <ul className="mx-2 shadow-inner h-[90%] w-full overflow-y-auto scrollbar-thin">
              {filteredMaterials.map((material) => (
                <li
                  key={material._id}
                  onClick={() => onMaterialClick(material)}
                  className="py-2 border-y-1 border-y px-2 cursor-pointer flex flex-row items-center gap-3 hover:bg-gray-shadow9 hover:text-text-black"
                >
                  <span className="bg-brand-blue p-1 rounded-full">
                    <FaBoxes className="text-text-white text-lg" />
                  </span>
                  <span>{material?.name || 'unnamed material'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="flex w-full h-full justify-center items-center font-semibold">
              {filterTerm
                ? `There is no material that matches ${filterTerm}`
                : `No material record found`}
            </span>
          )}
        </div>
      </div>

      {/* Enter quantity pannel */}
      {selectedMaterial && openEnterQuantityPannel && (
        <div className="inset-0 fixed bg-black bg-opacity-50 z-50 flex justify-center items-center ">
          <EnterQuantityPannel
            material={selectedMaterial}
            setMaterial={setSelectedMaterial}
            setOpenEnterQuantityPannel={setOpenEnterQuantityPannel}
            onCloseSelectItemPannel={onCloseSelectItemPannel}
            onChangePurchaseRecord={onChangePurchaseRecord}
            purchaseRecord={purchaseRecord}
          />
        </div>
      )}
    </div>
  );
};

export default SelectItemPannel;
