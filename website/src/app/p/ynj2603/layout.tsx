import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "업무 안내서",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProposalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
