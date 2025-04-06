import React from 'react';
import Image from 'next/image';
import * as XLSX from 'xlsx';
import { useBulkMaterialUpload } from '@/contexts/bulkMaterialUploadContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/account/Header';
import SubHeader from './SubHeader';
import MaterialSidebar from './materialSidebar';
import SuccessModal from '@/components/account/SuccessModal';
import PageDescription from '@/components/account/PageDescription';
import ErrorModal from '../../../ErrorModal';
import { verifyInputText } from '@/utilities/verifyInput';

const BulkMaterialsUpload = ({pageDescription}) => {

  const selectedSubMenu = {
    name: 'Create Material',
    link: '/',
  };

  const [file, setFile] = React.useState(null);
  const [error, setError] = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [reviewUpload, setReviewUpload] = React.useState(false);
  const { setBulkMaterialData, setErrorData, errorData } = useBulkMaterialUpload();
  const [errors, setErrors] = React.useState([]);
  const Router = useRouter();

  const validateFile = (file) => {
    if (!file) return false;
    const validFormats = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validFormats.includes(file.type)) {
      setError('Invalid file format. Please upload an xls or xlsx file.');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return false;
    }
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
      setError('');
    }
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (validateFile(uploadedFile)) {
      setFile(uploadedFile);
      setError('');
    }
  };

  const collateErrors = (data) => {
    const errors = [];
    data.forEach((material, index) => {
      let error = {
        name: [],
        materialType: [],
        category: [],
        unitOfMeasurement: [],
        description: [],
      }; 

      if (!material.name) {
        error.name.push({error: `Material name is required for row ${index + 1}`, row: index + 1});
      };
      if(!verifyInputText(material.name).passed){
        error.name.push({error: `${verifyInputText(material.name).message} on row ${index + 1}`, row: index + 1});
      };

      if (!material.materialType) {
        error.materialType.push({error: `Material type is required for row ${index + 1}`, row: index + 1});
      };
      if(!['raw-material', 'packaging'].includes(material.materialType)){
        error.materialType.push({error: `Material type must be either 'raw-material' or 'packaging-material' for row ${index + 2}. Please check the spellings on the template`, row: index + 1});
      };

      if (!material.category) {
        error.category.push({error:`Material category is required for row ${index + 1}`, row: index + 1});
      };
      if(!verifyInputText(material.category).passed){
        error.category.push({error:`${verifyInputText(material.category).message} on row ${index + 1}`, row: index + 1});
      };

      if (!material.unitOfMeasurement) {
        error.unitOfMeasurement.push({error: `Material unit of measurement is required for row ${index + 1}`, row: index + 1});
      };
      if(!verifyInputText(material.unitOfMeasurement).passed){
        error.unitOfMeasurement.push({error:`${verifyInputText(material.unitOfMeasurement).message} on row ${index + 1}`, row: index + 1});
      };


      if (!material.description) {
        error.description.push({error:`Material description is required for row ${index + 1}`, row: index + 1});
      };
      if(!verifyInputText(material.description).passed){
        error.description.push({error: `${verifyInputText(material.description).message} on row ${index + 2}`, row: index + 1});
      };
      
      errors.push({ ...error });

    });
    return errors;
  };

  const handleUpload = (e) => {
    e.preventDefault();

    try {
      setError('');
      setUploading(true);

      const validFileName = 'smartco_materials_upload_sheet'; // Define the file name
      if (file) {
        if (!validateFile(file) || !file.name.includes(validFileName)) {
          setError('File does not meet the required specification. Download required Template');
          setUploading(false);
          return;
        };
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        // Filter out columns that are "__EMPTY_*"
        const filteredData = jsonData.map((row) => {
          return Object.fromEntries(
            Object.entries(row).filter(([key]) => !key.startsWith("__EMPTY"))
          );
        });

        if(jsonData.length !== 0) {
          const uploadedDataSample = filteredData[0];
          const requiredHeadings = [
            'Material_Name', 
            'Type', 
            'Category', 
            'Unit_of_measurement',
            'Description'
          ];
          const hasRequiredHeadings = requiredHeadings.every((heading) =>
            Object.keys(uploadedDataSample).includes(heading)
          );

          if (!hasRequiredHeadings) {
            setError(`Please upload the correct Excel file we have provided: "${validFileName}"`);
            setUploading(false);
            return;
          };

          //format data with correct keys
          const materialData = filteredData.map((material) => {
            return {
              name: material.Material_Name,
              materialType: material.Type,
              category: material.Category,
              unitOfMeasurement: material.Unit_of_measurement,
              description: material.Description,
            };
          });

          if(!Object.keys(uploadedDataSample).includes('Material Name' && 'Type' && 'Category' && 'Unit' && 'Description')) {
            setError(`Please upload the correct Excel file we have provided ${validFileName}`);
            setUploading(false);
            return;
          };

          const collatedErrors = collateErrors(materialData);

          setBulkMaterialData(materialData);
          setErrorData(collatedErrors);
          setFile(null);
          setError('');
          setUploading(false);
          setReviewUpload(true);

        }else{
          setError('No data found in the uploaded file, please check the file and try again.');
          setUploading(false);
        };  
      };

      reader.onprogress = (data) => {
        if(data.lengthComputable){  
          const progress = Math.round((data.loaded / data.total) * 100);
          setUploadProgress(progress);
        };
      };

      reader.readAsArrayBuffer(file); // Read the file using XLSX
    } catch (error) {
      setError('An error occurred while uploading the file. Please try again.');
      setUploading(false);  
    };
  };

  return (
    <div>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div>
        <SubHeader title={'Bulk Upload Material'} />
      </div>
      <div className="flex flex-row gap-0 w-full h-full">
        <div className="min-w-fit">
          <MaterialSidebar 
            selectedSubMenu={selectedSubMenu}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className="flex flex-col w-full h-full">
          <div className="bg-background-1 p-5 my-2 mx-5 rounded-md h-full flex flex-col justify-center items-center">
            <div className='bg-text-white p-5 rounded-md min-h-[50vh] w-[40vw] flex flex-col justify-center items-center gap-2'>
              <h1 className='text-base font-bold'>Bulk Upload Materials</h1>
              <span className='text-text-gray text-sm'>upload bulk materials to your stores</span>
              <span className='text-success font-semibold my-2 text-xs'>Upload your filled excel template</span>
      
              <div 
                className="border-2 border-dashed border-gray-border rounded-lg p-6 text-center w-full" 
                onDrop={handleDrop} 
                onDragOver={(e) => e.preventDefault()}
              >
                {
                  file ? (
                    <div className='flex flex-col items-center gap-2'>
                      <Image src='/assets/excel.png' alt='excel file' width={150} height={150} />
                      <span className='text-text-gray text-sm'>{file.name}</span>
                    </div>
                  ):(
                    <div className='flex flex-col items-center'>
                      <Image src={'/assets/upload.png'} alt='upload file' width={70} height={70} className=''/>
                      <div className="text-text-gray mb-2">Drag and Drop File here</div>
                      <div className="text-text-gray mb-2">or</div>
                      <label className="cursor-pointer inline-block bg-gray-shadow9 hover:bg-gray-shadow7 px-4 py-2 rounded-md text-text-gray">
                        Browse file
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={handleFileChange}
                          accept=".xls, .xlsx"
                        />
                      </label>
                      <p className="text-sm text-gray-500 mt-2">Maximum file size 10MB</p>
                      <p className="text-sm text-gray-500">Supported formats: xls, xlsx</p>
                    </div>
                  )
                }
              </div>
              {error && <p className="text-error mt-1 text-base text-center">{error}</p>}
              {!error? 
                <button 
                  className={`${file ? 'bg-brand-blue hover:bg-blue-shadow5' : 'bg-gray-shadow9'} text-text-white px-6 py-2 rounded-md`} 
                  onClick={handleUpload} 
                  disabled={!file}
                >
                  Upload
                </button>:
                <div className="w-full flex flex-row justify-center gap-5 text-sm">
                  <a
                    onClick={()=>{setFile(null); setError('')}}
                    href="/documents/smartco_materials_upload_sheet.xlsx"
                    download
                    className="bg-brand-blue text-text-white rounded-md px-5 py-2 flex flex-row justify-center items-center gap-2 hover:bg-blue-shadow5"
                  >
                    <Image
                      src="/assets/download.png"
                      width={15}
                      height={15}
                      alt="Download"
                    />
                    Download Template
                  </a>
                  <button
                    onClick={()=>{setFile(null); setError('')}}
                    className="border border-brand-blue text-brand-blue rounded-md px-5 py-2 hover:bg-brand-blue hover:text-text-white"
                  >
                    Retry upload
                  </button>
                </div>
              }
            </div>
            
            {uploading && 
              <div className="mb-20 mt-5 flex flex-col justify-center items-center gap-2 w-[40vw]">
                <div className="text-text-black font-bold text-left text-base w-full">Upload Progress</div>
                <div className="bg-gray-shadow8 rounded-md w-full p-1 flex flex-row justify-between items-center gap-2">
                  <Image src={'/assets/excel.png'} alt='excel file' width={40} height={40} className=''/>
                  <div className='w-full bg-gray-shadow9 h-1 rounded-full'>
                    <div className="bg-brand-blue h-1 rounded-full" style={{ width: `${uploadProgress}%` }}>
                    </div>
                  </div>
                  <span>{`${uploadProgress}%`}</span>
                </div>
              </div>
            }
          </div>
          <PageDescription 
            pageDescription={ pageDescription } 
          />
        </div>
      </div>
      {reviewUpload && (
        <div className="inset-0 bg-black bg-opacity-70 fixed z-50 flex justify-center items-center">
          {
            errorData.every((error) => Object.values(error).every((value) => value.length === 0)) ? (
              <SuccessModal 
                message={'Successful upload'}
                title={'Bulk Upload Materials'}
                buttonStyle={'bg-brand-blue hover:bg-blue-shadow5'}
                onClose={() => Router.push('/pages/account/admin/manage-materials/bulk-upload-review')}
                buttonText={'Review Upload'}
                subText={'All materials have been uploaded successfully'}
              />
            ) : (
              <ErrorModal
                onClose={() => Router.push('/pages/account/admin/manage-materials/bulk-upload-review')}
                buttonText={'Review Errors'}
                title={'Bulk Upload Materials Error'}
                subText={'Some rows were not uploaded due to errors. please review the errors and try again'}
                message={'Error in upload'}
                buttonStyle={'bg-error hover:bg-error-hover'}
              />
            )
          }
        </div>
      )} 
    </div>
  );
};


export default BulkMaterialsUpload;