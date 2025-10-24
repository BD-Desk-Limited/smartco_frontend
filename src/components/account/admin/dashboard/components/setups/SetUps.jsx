import Spinner from '@/components/account/Spinner';
import SetUpAdminDisplay from './SetUpAdminDisplay';
import NonSetupAdminDisplay from './NonSetupAdminDisplay';

const SetUps = ({ setupProgress, loading, isSetUpAdmin }) => {

  // Show spinner until everything is ready
  if (loading || isSetUpAdmin === undefined || isSetUpAdmin === null) {
    return <Spinner />;
  }

  return (
    <>
      {isSetUpAdmin === true ? (
        <SetUpAdminDisplay setupProgress={setupProgress} />
      ) : (
        <NonSetupAdminDisplay loading={loading} />
      )}
    </>
  );
}

export default SetUps;