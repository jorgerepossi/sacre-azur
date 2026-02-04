// components/LoginButton.tsx
"use client";

import React from "react";

import { supabase } from "@/lib/supabaseClient";

// components/LoginButton.tsx

// components/LoginButton.tsx

// components/LoginButton.tsx

// components/LoginButton.tsx

// components/LoginButton.tsx

// components/LoginButton.tsx

// components/LoginButton.tsx

// components/LoginButton.tsx

const LoginButton = () => {
  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: "sudacadev@gmail.com",
      password: "5ud4cAD3v@1980AkJr",
    });

    if (error) {
      console.error("Error logging in:", error.message);
    } else {
      console.log("Login successful");
      window.location.reload();
    }
  };

  return (
    <button
      className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
      onClick={login}
    >
      Login
    </button>
  );
};

export default LoginButton;
