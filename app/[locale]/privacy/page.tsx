import { LegalDocument, legalMetadata, type LegalPageProps } from "@/components/legal-document";

export async function generateMetadata({ params }: LegalPageProps) {
  const { locale } = await params;
  return legalMetadata(locale, "privacy");
}

export default async function PrivacyPage({ params }: LegalPageProps) {
  const { locale } = await params;
  return <LegalDocument locale={locale} page="privacy" />;
}
