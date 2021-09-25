import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const ShowOrder = ({ currentUser, order }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const { doRequest, errors } = useRequest({
        url: "/api/payments",
        method: "post",
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push("/orders")
    })

    useEffect(() => {
        const findTimeLeft = () => {
            // calculating time left to expire in miliseconds
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft/ 1000));
        }

        // to show the first time
        findTimeLeft();

        // setting call of findTimeleft to call at interval of 1 second
        const timerId = setInterval(findTimeLeft, 1000);

        // to clear interval after time ends, it will be called when we navigate away from current component
        return () => {
            clearInterval(timerId);
        }
    }, [order]);

    if(timeLeft < 0) {
        return (
            <div>
                <h2>Order for: {order.ticket.id}</h2>
                <div className="text-red">Order Expired</div>
            </div>
        )
    }

    return (
        <div>
            <h2>Order for: {order.ticket.title}</h2>
            <div>Time left to pay: {timeLeft}s</div>
            <StripeCheckout
                className="mt-2"
                token={({ id }) => doRequest({ token: id})}
                stripeKey="pk_test_WGNBavq5ps6nF8EdK9djgAWm"
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
        </div>
    )
}

ShowOrder.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    const { order } = data;
    
    return {
        order
    }
}

export default ShowOrder