import {createContext, use, useEffect, useState} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth, useUser } from '@clerk/clerk-react';

export const AppContext = createContext();

export const AppContextProvider = (props) =>{

    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const {user}=useUser();
    const {getToken}=useAuth();


    const[searchFilter,setSearchFilter]=useState({
        title:'',
        location:''
    })
    const [isSearched,setIsSearched]=useState(false);
    const [jobs, setJobs] = useState([])
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)

    const [companyToken, setCompanyToken] = useState(null)
    const [companyData, setCompanyData] = useState(null)
    const [userData, setUserData] = useState(null)
    const [userApplications, setUserApplications] = useState([])

    const fetchJobs = async () => {
        try {
            const {data} = await axios.get(backendURL + '/api/jobs');
            if (data.success) {
                setJobs(data.jobs);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
        
    }

    //function to fetch company data

    const fetchCompanyData = async (token) => {
        try {
            const {data}=await axios.get(backendURL + '/api/company/company', {
                headers: {
                    token:companyToken
                }
            });
            if (data.success) {
                setCompanyData(data.company);
                console.log(data);
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    //Function to fetch user applications

    const fetchUserData = async () => {
        try {
            const token = await getToken();
            const {data} = await axios.get(backendURL + '/api/users/user', {
                headers: {
                    Authorization: `Bearer ${token}`//sending token in the header to verify user and get user data from backend. clerk middleware will decode the token.
                }
            });
            if (data.success) {
                setUserData(data.user);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };
    //Function to fetch user applications

    const fetchUserApplications = async () => {
        try {
            const token = await getToken();
            const {data} = await axios.get(backendURL + '/api/users/applications', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (data.success) {
                setUserApplications(data.jobApplications);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchJobs()
        const storedCompanyToken = localStorage.getItem('companyToken')
        if (storedCompanyToken) {
            setCompanyToken(storedCompanyToken)// whenever user reloads the web page, token is set in the state from local storage, so user remains logged in until token expires or user logs out
        }
    }, [])

    useEffect(() => {
        if (companyToken) {
            fetchCompanyData(companyToken);
        }
    }, [companyToken]);


    useEffect(() => {
        if (user) {
            fetchUserData();
            fetchUserApplications();
        }
    }, [user]);

    const value = {
        setSearchFilter,searchFilter,
        isSearched,setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData, setCompanyData,
        backendURL,
        userData, setUserData,
        userApplications, setUserApplications,
        fetchUserData,
        fetchUserApplications,
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
};