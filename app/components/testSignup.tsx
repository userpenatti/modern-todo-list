// testSignup.tsx
import { signUp } from "@/app/lib/supabase"; // Ajuste o caminho com base no projeto

const testSignup = async () => {
  const email = "test@example.com";
  const password = "password123";

  const { data, error } = await signUp(email, password);

  console.log("SignUp Response:", { data, error });
};

testSignup();
