"use client";
import { Typography } from "antd";
import { useEffect, useState } from "react";

type Props = {
  id?: any;
};

export default function ProductShowPage({ id }: Props) {
  const [product, setProduct] = useState<any>();
  const [reservation, setReservation] = useState<any>();

  const fetchProductDetail = async (id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch product");
      const rawData = await response.json();
      setProduct(rawData.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProductReservation = async (id: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/product/${id}/reservations`,
        {
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch reservation");
      const rawData = await response.json();
      console.log("rawData:", rawData);
      setReservation(rawData.data);
    } catch (error) {
      console.error(error);
    }
  };
  console.log("reservations:", reservation);

  useEffect(() => {
    if (id) {
      fetchProductDetail(id);
      fetchProductReservation(id);
    }
  }, [id]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "24px",
        padding: "40px",
      }}
    >
      {/* Left Box - Product Info */}
      <div
        style={{
          flex: "0 0 40%",
          border: "1px solid #E0E0E0",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <Typography
          style={{
            fontSize: "25px",
            fontWeight: "400",
            marginBottom: "30px",
          }}
        >
          {product?.name}
        </Typography>

        <div
          style={{
            marginTop: "20px",
            border: "1px solid #E0E0E0",
            display: "flex",
            justifyContent: "center",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <img
            src={product?.image_full_url}
            alt="Product"
            style={{
              width: "100%",
              maxWidth: "250px",
              height: "250px",
              objectFit: "cover",
            }}
          />
        </div>

        <Typography
          style={{ marginTop: "20px", fontSize: "22px", color: "#333" }}
        >
          €{product?.price}
        </Typography>

        <Typography
          style={{ marginTop: "20px", fontSize: "16px", color: "#666" }}
        >
          {product?.description}
        </Typography>
      </div>

      {/* Right Box - Reservations */}
      <div
        style={{
          flex: "1",
          border: "1px solid #E0E0E0",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <Typography
          style={{ fontSize: "22px", fontWeight: "500", marginBottom: "12px" }}
        >
          Reservations for this product
        </Typography>

        {reservation ? (
          <div style={{ marginTop: "16px" }}>
            <Typography>Date: {reservation.date}</Typography>
            <Typography>
              Returning Date: {reservation.returning_date}
            </Typography>
            <Typography>
              Extra Requirement: {reservation.extra_requirement}
            </Typography>
            <Typography>Price: €{reservation.price}</Typography>
            <Typography>Deposit: €{reservation.deposit}</Typography>
            <Typography>
              Remaining Payment: €{reservation.remaining_payment}
            </Typography>
          </div>
        ) : (
          <Typography style={{ marginTop: "16px" }}>
            No reservations found.
          </Typography>
        )}
      </div>
    </div>
  );
}
