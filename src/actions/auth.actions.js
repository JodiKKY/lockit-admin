"use server";

import { createClient } from "@/utils/supabase/server";

async function signInWithCredentials(payload) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });
  if (error) {
    console.log(error)
    throw new Error(`${error}`);
  }

  return data;
}

async function signUpWithCredentials(payload) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
  });
  if (error) {
    console.log(error)
    throw new Error(`${error}`);
  }

  return data;
}

async function signOut() {
  const supabase = createClient();
  const supabaseUser = await supabase.auth.getUser();
  if (supabaseUser.data.user) {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: "Failure to sign out" };
    }
  }
}

export { signInWithCredentials, signOut, signUpWithCredentials };
