import { NotFoundError } from '@node-microservices/common';
import express, { Request, Response, NextFunction } from 'express';
import { Ticket } from '../models/ticket';
const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response, next: NextFunction) => {
    console.log("/api/tickets/:id");

    const ticket = await Ticket.findById(req.params.id);

    if(!ticket) {
        throw new NotFoundError();
    }

    res.send({ ticket });
});

export { router as showTicketRouter };