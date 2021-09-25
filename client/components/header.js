import Link from 'next/link';

const func = ({ currentUser }) => {
    const links = [
        currentUser && { label: "My Orders", href: "/orders" },
        currentUser && { label: "Sell Tickets", href: "/tickets/new" },
        !currentUser && { label: "Sign Up", href: "/auth/signup" },
        !currentUser && { label: "Sign In", href: "/auth/signin" },
        currentUser && { label: "Sign Out", href: "/auth/signout" },
    ]
    .filter(config => config)
    .map(({ label, href }) => {
        return <li className="nav-item" key={href}>
            <Link href={href}>
                <a className="nav-link">{label}</a>
            </Link>
        </li>
    });

    return (
        <nav className='navbar navbar-light bg-light p-2'>
            <Link href="/">
                <a className="navbar-brand">Tickets</a>
            </Link>

            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">
                    {links}
                </ul>
            </div>
        </nav>
    );
}

export default func;