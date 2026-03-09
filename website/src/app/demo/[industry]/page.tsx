import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { industries, getIndustryBySlug } from "@/lib/demo-data";
import IndustryDemoContent from "@/components/demo/IndustryDemoContent";

export function generateStaticParams() {
  return industries.map((i) => ({ industry: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string }>;
}): Promise<Metadata> {
  const { industry } = await params;
  const data = getIndustryBySlug(industry);
  if (!data) return {};

  return {
    title: `${data.name} 마케팅 데모`,
    description: `${data.name} 업종 맞춤 마케팅 데모 - ${data.desc}. 홈페이지 제작, 인스타그램 광고, DB 수집, 성과 리포트까지.`,
    openGraph: {
      title: `${data.name} 마케팅 데모 | 폴라애드`,
      description: data.desc,
      url: `https://polarad.co.kr/demo/${data.slug}`,
    },
    alternates: {
      canonical: `https://polarad.co.kr/demo/${data.slug}`,
    },
  };
}

export default async function IndustryDemoPage({
  params,
}: {
  params: Promise<{ industry: string }>;
}) {
  const { industry } = await params;
  const data = getIndustryBySlug(industry);
  if (!data) return notFound();

  return <IndustryDemoContent data={data} />;
}
