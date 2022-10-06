//Make an error Screen

import React from 'react';
import { IconErrorRegular } from '@telefonica/mistica';

const ErrorScreen = () : JSX.Element => {
    return (
        <div className="error-container">
            
            <IconErrorRegular color={"#ff0000"}/>
            <h1>Oops! Something went wrong!</h1>
            <button className='try-again-button' onClick={
                () => {
                    window.location.reload();
                }
            }>Try again</button>
        </div>
    );
}

export default ErrorScreen;