"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);

  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/protected-links/${id}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Erreur pendant le fetch:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (data && !data.error) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            const absoluteUrl = data.originalLink.startsWith("http")
              ? data.originalLink
              : `http://${data.originalLink}`;
            router.push(absoluteUrl);
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [data, router]);

  if (!data) {
    return <div></div>;
  }

  if (data.error) {
    return (
      <div className="text-center">
        <h1 className="text-2xl m-5">This link doesn't exist..</h1>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Please wait</h1>

      <div key={countdown} className="countdown-number">
        {countdown}
      </div>

      <p>You will be redirected in {countdown} seconde(s)...</p>

      <style jsx>{`
        .page-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
          text-align: center;
        }

        .countdown-number {
          font-size: 5rem;
          font-weight: bold;
          margin: 1rem 0;
          animation: fadeInOut 1s ease;
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: scale(3);
          }
          10% {
            opacity: 1;
            transform: scale(1);
          }
          90% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(3);
          }
        }
      `}</style>
    </div>
  );
}
