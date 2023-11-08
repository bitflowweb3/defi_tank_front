import React from 'react';

const ScrollWrapper = ({ children, ...props }) => {
    return (
        <div className='relative flex-1 flex flex-col'>
            <div className='absolute w-full h-full flex flex-col overflow-x-hidden overflow-y-auto' {...props}>
                {children}
            </div>
        </div>
    )
}

export { ScrollWrapper }