import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-28 text-center">
      <p className="font-mono text-7xl font-bold text-gradient">404</p>
      <h1 className="mt-6 text-3xl font-bold">{t("title")}</h1>
      <p className="mt-3 max-w-md text-muted">{t("description")}</p>
      <Link href="/" className={buttonClasses("primary", "lg", "mt-8")}>
        {t("home")}
      </Link>
    </Container>
  );
}
