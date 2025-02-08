import {useState} from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCompanyData } from '@/contexts/companyDataContext';
import { salesPointLoginService } from '@/services/authServices';
import { useAuth } from '@/contexts/authContext';
import ErrorModal from '../commons/ErrorModal';

const LoginExisting = ({seller, setSeller}) => {
    const {companyData} = useCompanyData();
    const {setUser} = useAuth();
    const router = useRouter();
    const [showPin, setShowPin] = useState(false);
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const handleLogin = async() => { 
        setError('');
        const body = {
            pin: pin,
            staffId: seller?.staffId,
            deviceAuthorization: companyData?.authorizationToken,
        };

        if(pin.length < 4){
            setError('Pin must be at least 4 digits');
            return;
        };
        try{
            setLoading(true);
            const response = await salesPointLoginService(body);
            if(response.error){
                setError(response?.error);
                return;
            };
            if(response?.data){
                setUser(response?.data?.user);
                localStorage.setItem('token', response?.data?.token);
                router.push('/pages/dashboard/sales-point');
            }
        }catch(error){
            setError(error);
        }finally{
            setLoading(false);
        };
    };

  return (
    <div className='w-[85%] h-[80%] bg-white rounded-md shadow-md flex flex-col items-center justify-center p-5'>
        <div className='flex flex-row items-center gap-5 w-full'>
            <p onClick={()=>setSeller(null)} className='px-3 py-3 bg-gray-shadow9 rounded-[100%] cursor-pointer hover:bg-gray-shadow8'>
                <Image src='/assets/back_green.png' alt='back' width={15} height={20} className=''/>
            </p>
            <h1 className='flex text-xl font-bold w-full justify-center items-center text-center text-brand-green'>Welcome Back!</h1>
        </div>
        <div className='flex flex-col gap-5 items-center w-full justify-center'>
            <div>
                <Image src={seller?.imageURL || '/assets/anonymous.png'} alt='seller' width={150} height={100} className='rounded-[100%]'/>
            </div>    
            <span className='text-base w-full text-brand-green font-semibold'>{seller?.name}</span>
            <div className='w-full flex flex-col text-left'>
                <label htmlFor='pin' className='text-base text-brand-green font-semibold w-full text-left'>
                    Pin
                </label>
                <p className='py-2 px-3 border border-brand-green rounded-md flex flex-row items-center justify-center gap-2'>
                    <input 
                        type={showPin? 'text':'password'}
                        name='pin' 
                        id='pin' 
                        value={pin}
                        onChange={(e)=>setPin(e.target.value)}
                        placeholder='********'
                        className='w-full flex items-center focus:outline-none justify-center text-brand-green'
                    />
                    <Image 
                        src={showPin? '/assets/eye-closed-green.png':'/assets/eye-open-green.png'} 
                        alt='show password' 
                        height={25} 
                        width={25}
                        className='cursor-pointer'
                        onClick={()=>setShowPin(!showPin)}
                    />
                </p>
            </div>
            <button
              type="submit"
              onClick={handleLogin}
              disabled={!pin || loading}
              className={`h-10 w-full bg-brand-green rounded-md text-lg text-white ${loading || !pin || pin.length < 4
                ? 'cursor-not-allowed'
                : 'hover:bg-green-shadow3'
                } items-center justify-center`}
            >
              {loading ? (
                <>
                  <div className="spinner-border animate-spin inline-block w-5 h-5 border-4 border-t-6 border-t-brand-green border-white rounded-full mr-2"></div>
                  <span>Loading...</span>
                </>
              ) : (
                'Login'
              )}
            </button>
        </div>
        {error && 
            <div className='inset-0 fixed flex flex-col items-center justify-center bg-black bg-opacity-60 z-50'>
                <ErrorModal 
                    message={error} 
                    title='Error !!!' 
                    buttonStyle='bg-brand-green' 
                    onClose={()=>setError('')}
                />
            </div>
        }
    </div>
  )
}

export default LoginExisting;
