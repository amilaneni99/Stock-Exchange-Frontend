import { Link } from '@material-ui/core'
import React from 'react'

function NotConfirmedUser() {
    return (
        <div>
            User Not Confirmed!
            <Link href='/login'>Back to Login</Link>
        </div>
    )
}

export default NotConfirmedUser
