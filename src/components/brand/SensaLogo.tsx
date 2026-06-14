import Image from "next/image";
import { cn } from "@/src/utils/utils";

type SensaLogoProps = {
  size?: "sm" | "md";
  className?: string;
};

const sizeClass = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
};

const imageSize = {
  sm: 28,
  md: 36,
};

export function SensaLogo({ size = "md", className }: SensaLogoProps) {
  const pixelSize = imageSize[size];

  return (
    <Image
      src="/sensalogo.png"
      alt="Sensa logo"
      width={pixelSize}
      height={pixelSize}
      priority={size === "md"}
      className={cn("rounded-[8px] object-contain", sizeClass[size], className)}
    />
  );
}
