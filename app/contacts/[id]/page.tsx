import ShowContact from "../ShowContact";

export default function ReservationShowPage({
  params,
}: {
  params: { id: string };
}) {
  return <ShowContact id={params.id} />;
}
