import ExportContent from '@/components/account/ExportContent';
import React from 'react'
import { PhoneNumber } from 'react-phone-number-input';

const ReviewCreatedUsers = ({newUsers, existingUsers, usersWithErrors, onClose}) => {
    const  [dataToView, setDataToView] = React.useState(null);

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
                    Branches: user.branch.map(brnch => brnch.name)?.join(', '),
                    Phone_Number: user.phoneNumber,
                }))}
                onClose={() => setDataToView(null)}
                title={`Users ${
                    dataToView === newUsers? 'Created' :
                    dataToView === existingUsers? 'Already Existing' :' Users with Error'
                } (${dataToView.length})`}
                metadata={''}
            />
          </div>
        ):(
          <div className='bg-text-white rounded-lg max-w-[600px] h-[60vh] w-full flex flex-col items-center gap-4'>
              <h2 className='bg-brand-blue w-full text-center py-2 text-text-white rounded-t-lg'>Review Created Users</h2>
              <span>some of the users you uploaded were not created. please review them</span>
        
              <div>
                  <table className='w-full my-10'>
                      <thead>
                          <tr className='text-text-gray bg-text-white text-sm'>
                              <th className='p-2 border border-brand-gray'>News Users created</th>
                              <th className='p-2 border border-brand-gray'>Users Already existing</th>
                              <th className='p-2 border border-brand-gray'>{`Users with Error(not created)`}</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr className='text-center '>
                              <td className='p-2'>
                                  <span className='font-semibold'>{newUsers?.length} users </span>
                                  <br/>
                                  <strong 
                                      className='text-sm hover:underline cursor-pointer text-text-blue' 
                                      onClick={()=>{setDataToView(newUsers)}}
                                  >
                                      View Users
                                  </strong>
                              </td>
                              <td className='p-2'>
                                  <span className='font-semibold'>{existingUsers?.length} users</span>
                                  <br/>
                                  <strong 
                                      className='text-sm hover:underline cursor-pointer text-text-blue' 
                                      onClick={()=>{setDataToView(existingUsers)}}
                                  >
                                      View Users
                                  </strong>
                              </td>
                              <td className='p-2'>
                                  <span className='font-semibold'>{usersWithErrors?.length} users</span>
                                  <br/>
                                  <strong 
                                      className='text-sm hover:underline cursor-pointer text-text-blue' 
                                      onClick={()=>{setDataToView(usersWithErrors)}}
                                  >
                                      View Users
                                  </strong>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </div>
              <div className='flex flex-col items-center gap-2'>
                  <button 
                      className='bg-brand-blue text-text-white px-4 py-2 rounded-lg hover:bg-brand-blue-dark'
                      onClick={onClose}
                  >
                      Close
                  </button>
              </div>
          </div>
        )}
    </>)
}

export default ReviewCreatedUsers;