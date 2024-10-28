import { GET_AUTH_USER } from '@/graphql/query/user.query';
import { useQuery } from '@apollo/client';
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
  const { data } = useQuery(GET_AUTH_USER);

  console.log(data,'data')

  if(!data?.authenticatedUser) return <Navigate to={'/login'}/>

  return <Outlet/>

}

export default ProtectedRoutes
