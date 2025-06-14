import { getAllTeamsByCompanyID } from '@/services/usersServices';
import React, { useEffect } from 'react'

const SelectUserTeam = ({formData, setFormData}) => {

    const [team, setTeam] = React.useState({});
    const [allTeams, setAllTeams] = React.useState([]);
    const [createNewTeam, setCreateNewTeam] = React.useState(false);
    const [selectedTeam, setSelectedTeam] = React.useState({});

    useEffect(() => {
        setTeam(formData.team);
    }, [formData]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await getAllTeamsByCompanyID();
                if(response && response.data) {
                    setAllTeams(response.data);
                }else {
                    console.error('Failed to fetch teams:', response.error);
                }
            }catch (error) {
                console.error('Error fetching teams:', error);
            }
        }
        fetchTeams();
    }, []);

    const handleTeamChange = (value) => {
        const selected = allTeams.find(team => team._id === value);
        setSelectedTeam(selected);
        setFormData({
            ...formData,
            team: selected || {}
        });
    }
    
  return (
    <div className='bg-white shadow-md rounded-lg p-5 mr-10 relative h-full'>
      {createNewTeam ? (
        <div className='text-text-gray'>
            <h2>Team/department</h2>
            <div 
                className='text-right w-full '
            >
                <input 
                    type='text'
                    placeholder='Enter new team name'
                    value={team.name || ''}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            team: { name: e.target.value }
                        });
                    }}
                    className='w-full p-2 border my-10 border-brand-gray rounded focus:outline-none focus:border-brand-blue mb-2'
                />
                <strong 
                    
                    onClick={() => setCreateNewTeam(false)}
                    className='text-brand-blue cursor-pointer hover:underline'
                > 
                    choose an existing team
                </strong>
            </div>
        </div>
        ) : (
            <div>
                {allTeams?.length > 0 ? (
                    <div className='text-text-gray'>
                        <h2>Select team/department</h2>
                        <div className='my-10 w-full flex flex-col'>
                            <select
                                value={selectedTeam && selectedTeam._id ? selectedTeam._id : ''}
                                onChange={(e) => {
                                    handleTeamChange(e.target.value);
                                }}
                                className='w-full p-2 border border-brand-gray rounded focus:outline-none focus:border-brand-blue'
                            >
                                <option value='' className='bg-blue-shadow9'> ----Select a team---- </option>
                                {allTeams.map((team) => (
                                    <option key={team._id} value={team._id}>
                                        {team.name}
                                    </option>
                                ))}
                            </select>
                            <span 
                                className='text-right w-full '
                            >
                                can&apos;t find team on the list?  
                                <strong
                                    onClick={() => {
                                        setCreateNewTeam(true); 
                                        setSelectedTeam({}); 
                                        setFormData({...formData, team: {}});
                                    }} 
                                    className='text-brand-blue cursor-pointer hover:underline'> create a new one
                                </strong>
                            </span>
                        </div>
                    </div>
                  ) : (
                    <div className='flex flex-col items-center justify-center h-full my-10'>
                        <div className='text-text-gray text-center'>
                            No existing team/department found
                        </div>
                        <strong
                            onClick={() => {
                                setCreateNewTeam(true); 
                                setSelectedTeam({}); 
                                setFormData({...formData, team: {}});
                            }} 
                            className='text-brand-blue text-center w-full cursor-pointer hover:underline'> create new team for this user
                        </strong>
                    </div>
                )}
            </div>
        )
      }
    </div>
  )
}

export default SelectUserTeam;