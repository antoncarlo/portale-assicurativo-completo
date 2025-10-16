import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  products: router({
    list: publicProcedure.query(async () => {
      const { getAllProducts } = await import("./db");
      return await getAllProducts();
    }),
  }),

  policies: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getAllPolicies } = await import("./db");
      const allPolicies = await getAllPolicies();
      const { getAllProducts } = await import("./db");
      const products = await getAllProducts();
      
      const policiesWithProduct = allPolicies.map(policy => {
        const product = products.find(p => p.id === policy.productTypeId);
        return {
          ...policy,
          productType: product || { name: "Unknown", code: "unknown" }
        };
      });
      
      return { policies: policiesWithProduct };
    }),
    
    stats: publicProcedure.query(async () => {
      const { getPolicyStats } = await import("./db");
      const stats = await getPolicyStats();
      return {
        total: stats.total,
        active: stats.active,
        by_status: stats.byStatus,
        total_premium: stats.totalPremium
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
