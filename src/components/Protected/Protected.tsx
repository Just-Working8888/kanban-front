import React, { FC, ReactNode } from 'react'
import CheckAuth from '../auth/CheckAuth'

const Protected: FC<{ children: ReactNode, fallBack: any }> = ({ children, fallBack }) => {

    if (!localStorage.getItem('userId') && !localStorage.getItem('token')) {
        return fallBack
    }

    
    return <>
        <CheckAuth />
        {children}
    </>
}

export default Protected

