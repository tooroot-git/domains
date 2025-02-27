import type { Express } from "express";
import { createServer, type Server } from "http";
import domainAppraisalRouter from './routes/domainAppraisal';

export async function registerRoutes(app: Express): Promise<Server> {
    const httpServer = createServer(app);

    // Use the domainAppraisalRouter
    app.use('/api/domain-appraisal', domainAppraisalRouter);

    return httpServer;
}