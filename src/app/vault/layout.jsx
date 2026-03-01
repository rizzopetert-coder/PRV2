import VaultNav from "@/components/vault/VaultNav";

export const metadata = {
  title: {
    template: "%s | The Vault — Principal Resolution",
    default: "The Vault — Principal Resolution",
  },
  description:
    "Forensic proof and resolution architecture for the twelve institutional patterns that consume leadership capacity.",
  openGraph: {
    siteName: "Principal Resolution",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function VaultLayout({ children }) {
  return (
    <>
      <VaultNav />
      {children}
    </>
  );
}