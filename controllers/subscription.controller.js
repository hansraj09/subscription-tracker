import { workflowClient } from '../config/upstash.js';
import Subscription from '../models/subscription.model.js';
import { SERVER_URL } from '../config/env.js';

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create( {
      ...req.body,
      user: req.user._id,
    });

    await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subsciption/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        'content-type': 'application/json',
      },
      retries: 0,
    })

    res.status(201).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
}

export const getUserSubscriptions = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      const error = new Error("You are not the owner of this account");
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });
    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
}

export const getSubsciptionDetails = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id).populate('user', 'name email');
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.status = 404;
      throw error;
    }
    if (subscription.user._id.toString() !== req.user.id) {
      const error = new Error("You are not the owner of this subscription");
      error.status = 401;
      throw error;
    }
    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
}

export const updateSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.status = 404;
      throw error;
    }
    if (subscription.user.toString() !== req.user.id) {
      const error = new Error("You are not the owner of this subscription");
      error.status = 401;
      throw error;
    }
    Object.assign(subscription, req.body);
    await subscription.save();
    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
}

export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.status = 404;
      throw error;
    }
    if (subscription.user.toString() !== req.user.id) {
      const error = new Error("You are not the owner of this subscription");
      error.status = 401;
      throw error;
    }
    await subscription.remove();
    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
}

export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.status = 404;
      throw error;
    }
    if (subscription.user.toString() !== req.user.id) {
      const error = new Error("You are not the owner of this subscription");
      error.status = 401;
      throw error;
    }
    subscription.status = 'canceled';
    await subscription.save();
    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
}

export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    const subscriptions = await Subscription.find({
      renewalDate: { $gte: today, $lte: nextWeek },
      user: req.user.id,
      status: 'active',
    });
    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
}

export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find().populate('user', 'name email');
    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};
