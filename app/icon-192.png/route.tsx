import { ImageResponse } from "next/og";
import { AppIconMark } from "../appIcon";

export const dynamic = "force-static";

export async function GET() {
  return new ImageResponse(<AppIconMark size={192} />, { width: 192, height: 192 });
}
