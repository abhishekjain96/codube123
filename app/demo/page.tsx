import SiteRendererV2 from "@/components/site/SiteRendererV2";
import { sampleSite } from "@/lib/sampleSite";

export default function DemoPage() {
  return <SiteRendererV2 site={sampleSite} />;
}