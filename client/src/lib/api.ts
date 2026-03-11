import { queryClient } from "./queryClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Product, Review, Coupon } from "@shared/schema";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }
  return res.json();
}

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: () => fetchJson<Product[]>("/api/products"),
  });
}

export function useProduct(id: string | undefined) {
  return useQuery<Product>({
    queryKey: ["/api/products", id],
    queryFn: () => fetchJson<Product>(`/api/products/${id}`),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderData: {
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      address: string;
      items: string;
      total: number;
    }) => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) throw new Error("Sifariş yaradılarkən xəta baş verdi");
      return res.json();
    },
  });
}

export type ReviewStats = Record<number, { avgRating: number; count: number }>;

export function useAllReviewStats() {
  return useQuery<ReviewStats>({
    queryKey: ["/api/reviews"],
    queryFn: () => fetchJson<ReviewStats>("/api/reviews"),
  });
}

export function useReviews(productId: number | undefined) {
  return useQuery<Review[]>({
    queryKey: ["/api/reviews", productId],
    queryFn: () => fetchJson<Review[]>(`/api/reviews/${productId}`),
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { productId: number; author: string; rating: number; comment: string }) => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Rəy əlavə edilərkən xəta baş verdi");
      return res.json();
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["/api/reviews", variables.productId] });
      qc.invalidateQueries({ queryKey: ["/api/reviews"] });
    },
  });
}

export function useValidateCoupon() {
  return useMutation({
    mutationFn: async (code: string): Promise<Coupon> => {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Etibarsız kupon");
      }
      return res.json();
    },
  });
}
