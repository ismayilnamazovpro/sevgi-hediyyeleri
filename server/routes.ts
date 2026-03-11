import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/products", async (_req, res) => {
    const products = await storage.getAllProducts();
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Etibarsız məhsul ID" });
    }
    const product = await storage.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Məhsul tapılmadı" });
    }
    res.json(product);
  });

  app.get("/api/products/category/:category", async (req, res) => {
    const products = await storage.getProductsByCategory(req.params.category);
    res.json(products);
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Etibarsız sifariş məlumatı", errors: error.errors });
      }
      throw error;
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Etibarsız sifariş ID" });
    }
    const order = await storage.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: "Sifariş tapılmadı" });
    }
    res.json(order);
  });

  app.get("/api/reviews", async (_req, res) => {
    const allReviews = await storage.getAllReviews();
    const stats: Record<number, { count: number; total: number }> = {};
    for (const r of allReviews) {
      if (!stats[r.productId]) stats[r.productId] = { count: 0, total: 0 };
      stats[r.productId].count++;
      stats[r.productId].total += r.rating;
    }
    const result: Record<number, { avgRating: number; count: number }> = {};
    for (const [pid, s] of Object.entries(stats)) {
      result[Number(pid)] = { avgRating: Math.round((s.total / s.count) * 10) / 10, count: s.count };
    }
    res.json(result);
  });

  app.get("/api/reviews/:productId", async (req, res) => {
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Etibarsız məhsul ID" });
    }
    const productReviews = await storage.getReviewsByProductId(productId);
    res.json(productReviews);
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Etibarsız rəy məlumatı", errors: error.errors });
      }
      throw error;
    }
  });

  app.post("/api/coupons/validate", async (req, res) => {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Kupon kodu tələb olunur" });
    }
    const coupon = await storage.getCouponByCode(code.toUpperCase());
    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ message: "Etibarsız və ya müddəti bitmiş kupon kodu" });
    }
    res.json(coupon);
  });

  return httpServer;
}
