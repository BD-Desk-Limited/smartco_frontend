import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import EditTaxBand from './components/EditTaxBand';
import { getTaxBandDetailsById } from '@/services/taxBandServices';
import Spinner from '../../Spinner';

const EditTaxBandPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [taxbandData, setTaxbandData] = React.useState(null);
  const [selectedMenu, setSelectedMenu] = React.useState('tax-management');

  const pageDescription =
    'This page allows you to manage tax bands for your branches. You can make changes to the tax rates, set when the rates are applicable. Products specific taxes can be set in the product management page. The tax rates set here will be applied to all products in the branches, unless a product is configured as tax exempt. If a product has additional tax rules, those will be in addition to the default taxband the branches where the product is sold.';

  // Fetch user data based on the id from the URL
  React.useEffect(() => {
    // Fetch tax band data by id
    if (id) {
      const fetchTaxBandData = async () => {
        setLoading(true);
        const response = await getTaxBandDetailsById(id);
        setLoading(false);
        if (response.data) {
          setTaxbandData(response.data);
        }
        if (response.error) {
          console.error('Error fetching tax band data:', response.error);
          router.push('/pages/account/admin/tax-management/');
        }
      };
      fetchTaxBandData();
    }
  }, [id, router]);

  // Redirect to the taxband management page if no id is provided
  React.useEffect(() => {
    if (!id) {
      router.push('/pages/account/admin/tax-management/');
    }
  }, [id, router]);

  // Check if the user has access to this page
  const accessCheckFailed = PageAccessRequirement('admin', 'Tax_Management');

  if (accessCheckFailed) {
    return accessCheckFailed;
  }

  return (
    <div>
      {id && !loading && taxbandData ? (
        <EditTaxBand
          taxbandData={taxbandData}
          setTaxbandData={setTaxbandData}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          pageDescription={pageDescription}
        />
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default EditTaxBandPage;
