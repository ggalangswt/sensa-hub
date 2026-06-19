import type { Metadata } from "next";
import Landing from "@/src/modules/landing/Landing";

export const metadata: Metadata = {
  other: {
    "talentapp:project_verification":
      "25d42c9f3007fa57dd5c2778ca797ab43c5d3a9e6a97517888839eada5fea17aba02ab625346b9b84a7cf72964ba83b2e865a0775e3350f63a37e7c657e0043a",
  },
};

export default function Home() {
  return <Landing />;
}
