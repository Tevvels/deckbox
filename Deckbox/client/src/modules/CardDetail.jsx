import React, { useEffect, useState } from "react";
import Gradient from "./Gradient";
import { set } from "mongoose";
import Card from "../features/cards/Card";
// have it so when I click on the card it goes to this page with more details
// import Card from '../data/Card.json'

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";


function CardDetail({ card, onClose, onUpdateSuccess }) {
  const [AllPrints, setAllPrints] = useState([]);
  const [currentImage, setCurrentImage] = useState(card);

  const handleUpdateArt = async () => {
    try {
      const imageToUpdate =
        currentImage.image_uris || currentImage.card_faces?.[0]?.image_uris;
      const response = await fetch(
        `${API_BASE}/cardStorage/update-art/${card._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            scryfallId: currentImage.id,
            image_uris: imageToUpdate,
          }),
        },
      );
      if (response.ok) {
        onUpdateSuccess(card._id, {
          scryfallId: currentImage.id,
          image_uris: imageToUpdate,
        });
        onClose();
      }
    } catch (err) {
      console.error("Error updating card art:", err);
    }
  };
  useEffect(() => {
    if (card && card.name) {
      setCurrentImage(card);
      setAllPrints([]); // Reset before fetching new prints

      const query = `!"${card.name}"`;
      const url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&unique=prints`;
      fetch(url)
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then((data) => {
          if (data.data) {
            setAllPrints(data.data);
            const matchingPrint =
              data.data.find((p) => p.id === card.scryfallId) || data.data[0];
            if (matchingPrint) {
              setCurrentImage(matchingPrint);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching card prints:", error);
          setAllPrints([]);
        });
    }
  }, [card]);

  if (!card || !currentImage) return null;
  return (

      <Card
        currentImage={currentImage}
        Allprints={AllPrints}
        onSelectPrint={setCurrentImage}
        OnUpdateArt={handleUpdateArt}
        onClose={onClose}
      />);
}

export default CardDetail;
