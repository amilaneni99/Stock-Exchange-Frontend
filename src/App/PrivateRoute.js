import { Redirect, Route } from "react-router-dom"
import { fakeAuth } from "./auth"

export default function PrivateRoute({children, ...rest}) {
    return (
        <Route {...rest} render={({ location }) => {
            console.log(fakeAuth.isAuthenticated);
            return fakeAuth.isAuthenticated === true
                ? children
                : <Redirect to={{
                    pathname: '/login',
                    state: { from: location }
                }}
                />
        }} />
    )
}