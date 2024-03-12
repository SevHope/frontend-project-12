import { useContext } from 'react';
import authContext from '../contexts/Auth';

const useAuth = () => useContext(authContext);

export default useAuth;
