"use client";

import { PROTECTED_ROUTE } from "@/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    router.replace(PROTECTED_ROUTE.dashboard);
  }, [router]);

  return null;
}
