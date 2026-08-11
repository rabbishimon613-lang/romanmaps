import Map from "./Map";
import Chrome from "./Chrome";
import Ruler from "./Ruler";
import ZoomControl from "./ZoomControl";

export default function Page() {
  return (
    <main style={{ position: "fixed", inset: 0 }}>
      <Map />
      <Chrome />
      <Ruler />
      <ZoomControl />
    </main>
  );
}
