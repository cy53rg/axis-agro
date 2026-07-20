import { PageFade } from "@/components/motion/PageFade";

export default function PublicTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PageFade>{children}</PageFade>;
}
