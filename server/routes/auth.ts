import { router, publicProcedure } from "../_core/trpc";
import bcrypt from "bcryptjs";

export const authRouter = router({
  login: publicProcedure
    .input((input: any) => input)
    .mutation(async ({ input }) => {
      const { getUserByUsername, updateLastSignIn } = await import("../db");
      
      const { username, password } = input;
      
      if (!username || !password) {
        throw new Error("Username e password richiesti");
      }

      const user = await getUserByUsername(username);
      
      if (!user) {
        throw new Error("Credenziali non valide");
      }

      if (!user.isActive) {
        throw new Error("Account disattivato");
      }

      // Verifica password
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        throw new Error("Credenziali non valide");
      }

      // Aggiorna ultimo accesso
      await updateLastSignIn(user.id);

      // Ritorna user senza password
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        success: true,
        user: userWithoutPassword
      };
    }),

  register: publicProcedure
    .input((input: any) => input)
    .mutation(async ({ input }) => {
      const { getUserByUsername, createUser } = await import("../db");
      
      const { username, password, email, name, phone, role, commissionRate } = input;
      
      if (!username || !password || !email) {
        throw new Error("Username, password e email richiesti");
      }

      // Verifica se username esiste già
      const existingUser = await getUserByUsername(username);
      if (existingUser) {
        throw new Error("Username già esistente");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crea utente
      const userId = await createUser({
        username,
        password: hashedPassword,
        email,
        name,
        phone,
        role,
        isActive: true,
        commissionRate,
      } as any);

      return {
        success: true,
        userId
      };
    }),

  me: publicProcedure.query(async ({ ctx }) => {
    // Placeholder - implementeremo con sessioni
    return null;
  }),
});

