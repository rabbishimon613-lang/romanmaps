import Map from "./Map";
import Chrome from "./Chrome";
import Ruler from "./Ruler";
import ZoomControl from "./ZoomControl";
import PlaceDetails from "./PlaceDetails";
import Legend from "./Legend";

export default function Page() {
  return (
    <main style={{ position: "fixed", inset: 0 }}>
      <Map />
      <Chrome />
      <Ruler />
      <Legend />
      <ZoomControl />
      <PlaceDetails />
    </main>
  );
}
