import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { authRouter } from "./routes/auth";

export const appRouter = router({
  system: systemRouter,

  customAuth: authRouter,

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
    getById: publicProcedure
      .input((input: any) => input)
      .query(async ({ input }) => {
        const { getPolicyById } = await import("./db");
        return await getPolicyById(input);
      }),
    
    getCommunications: publicProcedure
      .input((input: any) => input)
      .query(async ({ input }) => {
        const { getPolicyCommunications } = await import("./db");
        return await getPolicyCommunications(input);
      }),
    
    addCommunication: publicProcedure
      .input((input: any) => input)
      .mutation(async ({ input }) => {
        const { addPolicyCommunication } = await import("./db");
        return await addPolicyCommunication(input);
      }),
    
    list: publicProcedure.query(async () => {
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
        inQuotation: stats.inQuotation,
        total_premium: stats.totalPremium
      };
    }),
    
    create: publicProcedure
      .input((input: any) => input)
      .mutation(async ({ input }) => {
        const { createPolicy } = await import("./db");
        const { randomUUID } = await import("crypto");
        
        const newPolicy = {
          id: randomUUID(),
          policyNumber: null,
          productTypeId: input.productTypeId,
          userId: "demo-user",
          clientName: input.clientName,
          clientEmail: input.clientEmail || null,
          clientPhone: input.clientPhone || null,
          status: "quote_requested" as const,
          premiumAmount: null,
          startDate: null,
          endDate: null,
          notes: input.notes || null,
        };
        
        await createPolicy(newPolicy);
        return { success: true, policy: newPolicy };
      }),
    
    updateStatus: publicProcedure
      .input((input: any) => input)
      .mutation(async ({ input }) => {
        const { updatePolicy } = await import("./db");
        return await updatePolicy(input.id, { status: input.status });
      }),
    
    delete: publicProcedure
      .input((input: any) => input)
      .mutation(async ({ input }) => {
        const { deletePolicy } = await import("./db");
        return await deletePolicy(input);
      }),
  }),

  claims: router({
    list: publicProcedure.query(async () => {
      const { getAllClaims } = await import("./db");
      const allClaims = await getAllClaims();
      const { getAllPolicies } = await import("./db");
      const allPolicies = await getAllPolicies();
      
      const claimsWithPolicy = allClaims.map(claim => {
        const policy = allPolicies.find(p => p.id === claim.policyId);
        return {
          ...claim,
          policy: policy || null
        };
      });
      
      return { claims: claimsWithPolicy };
    }),
    
    getById: publicProcedure
      .input((input: any) => input)
      .query(async ({ input }) => {
        const { getClaimById } = await import("./db");
        return await getClaimById(input);
      }),
    
    updateStatus: publicProcedure
      .input((input: any) => input)
      .mutation(async ({ input }) => {
        const { updateClaim } = await import("./db");
        return await updateClaim(input.id, { status: input.status });
      }),
    
    create: publicProcedure
      .input((input: any) => input)
      .mutation(async ({ input }) => {
        const { createClaim } = await import("./db");
        const { randomUUID } = await import("crypto");
        
        const newClaim = {
          id: randomUUID(),
          claimNumber: `CLM-${Date.now()}`,
          policyId: input.policyId,
          claimDate: new Date(input.claimDate),
          description: input.description,
          status: "reported" as const,
          claimAmount: input.claimAmount || null,
          paidAmount: null,
          notes: input.notes || null,
        };
        
        await createClaim(newClaim);
        return { success: true, claim: newClaim };
      }),
  }),

  documents: router({
    list: publicProcedure.query(async () => {
      const { getAllDocuments } = await import("./db");
      return { documents: await getAllDocuments() };
    }),
  }),
});


export type AppRouter = typeof appRouter;
