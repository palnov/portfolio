import { getCmsContent } from "@/lib/yandex";
import ClientPage from "@/components/ClientPage";

// Force Next.js to render dynamically on every request to bypass Vercel server caches and fetch live data instantly.
export const dynamic = "force-dynamic";
export const revalidate = 0; 

export default async function Page() {
  const { studioInfo, services } = await getCmsContent();
  
  return <ClientPage studioInfo={studioInfo} services={services} />;
}
