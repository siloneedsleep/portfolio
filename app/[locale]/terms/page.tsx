import { LegalDocument, legalMetadata, type LegalPageProps } from "@/components/legal-document";

export async function generateMetadata({ params }: LegalPageProps) {
  const { locale } = await params;
  return legalMetadata(locale, "terms");
}

export default async function TermsPage({ params }: LegalPageProps) {
  const { locale } = await params;
  return <LegalDocument locale={locale} page="terms" />;
}
