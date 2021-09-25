const OrdersList = ({ orders }) => {
    orders = orders.map(order => {
        return (
            <li key={order.id}>
                {order.ticket.title} - {order.status}
            </li>
        )
    })

    return (
        <div>
            <h1>MY ORDERS</h1>
            <ul>{orders}</ul>
        </div>
    )
}

OrdersList.getInitialProps = async (context, client) => {
    const { data } = await client.get("/api/orders");
    const { orders } = data;

    return {
        orders
    }
}

export default OrdersList;