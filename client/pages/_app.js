import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const func = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser} />
            <div className='container'>
                <Component currentUser={currentUser} {...pageProps} />
            </div>
        </div>
    )
}

/**
 * getInitialProps may be called from server side or browser
 * if we go from one page to other, getInitialProps is called from browser
 * in cases like hard reload or accessing url or from other reference, it will be called from server side
**/
func.getInitialProps = async (context) => {
    const client = buildClient(context.ctx);
    const { data } = await client.get("/api/users/currentuser");

    let pageProps = {};
    if(context.Component.getInitialProps) {
        pageProps = await context.Component.getInitialProps(context.ctx, client, data.currentUser);
    }

    return {
        pageProps,
        currentUser: data.currentUser
    };
}

export default func;