import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./Carousel.css";
import Navbar from "./Navbar";

export default function Carousel({ setSearchQuery, searchQuery }) {
  const navigate = useNavigate();

  // Sample carousel images (replace with your actual image URLs)
 

  return (
    <div className="carousel-page-container">
      {/* Navbar at the very top with zero margin */}
      <Navbar />

      <div className="carousel-content-container">
        <div className="carousel-wrapper">
          {/* 🔍 Search Bar with Button */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search for food..."
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
              />
              <button className="search-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Carousel - Only shown when search query is empty */}
          {searchQuery === "" && (
            <div id="foodCarousel" className="carousel slide" data-bs-ride="carousel">
             
              
              
              
              <button className="carousel-control-prev" type="button" data-bs-target="#foodCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true" />
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#foodCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true" />
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}