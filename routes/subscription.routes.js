import { Router } from 'express';
import authorize from '../middlewares/auth.middleware';
import { cancelSubscription, createSubscription, deleteSubscription, getAllSubscriptions, getSubsciptionDetails, getUpcomingRenewals, getUserSubscriptions, updateSubscription } from '../controllers/subscription.controller';

const subscriptionRouter = Router();

subscriptionRouter.get('/', authorize, getAllSubscriptions);
subscriptionRouter.get('/:id', getSubsciptionDetails);
subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.put('/:id', updateSubscription);
subscriptionRouter.delete('/:id', deleteSubscription);
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);
subscriptionRouter.get('/:id/cancel', cancelSubscription);
subscriptionRouter.get('/upcoming-renewals', getUpcomingRenewals);

export default subscriptionRouter;