import ShowReservation from "../ShowReservation";

export default function ReservationShowPage({
  params,
}: {
  params: { id: string };
}) {
  return <ShowReservation id={params.id} />;
}
