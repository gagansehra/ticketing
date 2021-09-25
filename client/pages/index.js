import Link from 'next/link';

const func = ({ currentUser, tickets }) => {
    const ticketList = tickets.map(ticket => {
        return (
            <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                    <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                        <a>View</a>
                    </Link>
                </td>
            </tr>
        )
    })

    return (
        <div>
            <h1>Tickets</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Show Details</th>
                    </tr>
                </thead>
                <tbody>
                    {ticketList}
                </tbody>
            </table>
        </div>
    )
}

/**
 * getInitialProps may be called from server side or browser
 * if we go from one page to other, getInitialProps is called from browser
 * in cases like hard reload or accessing url or from other reference, it will be called from server side
**/
func.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get("/api/tickets");

    return { tickets: data.tickets };
}

export default func;