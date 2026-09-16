"use client";
import { Toaster } from "react-hot-toast";

import React from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster
        position="bottom-right"
        containerStyle={{
          bottom: 28,
          right: 28,
          zIndex: 99999,
        }}
        toastOptions={{
          duration: 5000,
          style: {
            background: "#0f172a",
            color: "#f8fafc",
            borderRadius: "14px",
            padding: "14px 20px",
            fontSize: "14px",
            fontWeight: 500,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.25)",
            border: "1px solid #334155",
            maxWidth: "480px",
          },
          error: {
            duration: 6000,
            style: {
              background: "#450a0a",
              color: "#fee2e2",
              border: "1px solid #b91c1c",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
          success: {
            duration: 4000,
            style: {
              background: "#052e16",
              color: "#dcfce7",
              border: "1px solid #15803d",
            },
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ffffff",
            },
          },
        }}
      />
      {children}
    </>
  );
};

export default Providers;