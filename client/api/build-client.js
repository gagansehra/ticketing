import axios from 'axios';

const func = ({ req }) => {
    if(typeof window === 'undefined') {
        // On Server

        return axios.create({
            baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
            headers: req.headers
        });
    } else {
        // On Browser - header are managed automatically
        return axios.create({
            baseURL: "/"
        })
    }
}

export default func;