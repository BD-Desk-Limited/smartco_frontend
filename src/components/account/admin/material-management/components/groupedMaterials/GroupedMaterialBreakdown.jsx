import Spinner from '@/components/account/Spinner';
import { getMaterialComponentsBreakdown } from '@/services/materialServices';
import React from 'react';
import ResponsiveTable from '@/components/account/admin/ui/ResponsiveTable';

const GroupedMaterialBreakdown = ({ id }) => {
  const [groupedMaterialBreakdown, setGroupedMaterialBreakdown] =
    React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchGroupedMaterialBreakdown = async () => {
      try {
        setLoading(true);
        const response = await getMaterialComponentsBreakdown(id);
        if (response.data) {
          setGroupedMaterialBreakdown(response.data);
        }
      } catch (error) {
        console.error('Error fetching grouped material breakdown:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroupedMaterialBreakdown();
  }, [id]);

  //get materials that appears twice, and sum up their quantities
  const aggregatedBreakdown = groupedMaterialBreakdown.reduce(
    (acc, material) => {
      const existingMaterial = acc.find((item) => item.name === material.name);
      if (existingMaterial) {
        existingMaterial.quantity += material.quantity;
      } else {
        acc.push({ ...material });
      }
      return acc;
    },
    []
  );

  return loading ? (
    <Spinner />
  ) : (
    <div className="w-full md:w-1/2 text-left">
      <h1 className="font-semibold">Components breakdown</h1>
      <ResponsiveTable
        align="left"
        dense
        maxHeightClass="md:max-h-40"
        rows={aggregatedBreakdown}
        columns={[
          { key: 'material', header: 'Material', cell: (m) => m.name, mobile: 'title' },
          {
            key: 'qty',
            header: 'Quantity',
            mobile: 'badge',
            cell: (m) => `${m.quantity} ${m?.unitOfMeasurement?.name || ''}`,
          },
        ]}
      />
    </div>
  );
};

export default GroupedMaterialBreakdown;
