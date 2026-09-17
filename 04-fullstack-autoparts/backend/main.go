package main

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Listing struct {
	ID        int     `json:"id"`
	Title     string  `json:"title"`
	PartName  string  `json:"part_name"`
	Make      string  `json:"make"`
	Model     string  `json:"model"`
	Year      int     `json:"year"`
	Price     float64 `json:"price"`
	Condition string  `json:"condition"`
	District  string  `json:"district"`
}

var listings = []Listing{
	{ID: 1, Title: "Aqua Headlight Original", PartName: "Headlight", Make: "Toyota", Model: "Aqua", Year: 2014, Price: 28500, Condition: "Used", District: "Colombo"},
	{ID: 2, Title: "Civic Front Bumper", PartName: "Bumper", Make: "Honda", Model: "Civic", Year: 2018, Price: 45000, Condition: "Brand New", District: "Gampaha"},
}
var nextID = 3

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	api := r.Group("/api")
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Go API is running!"})
		})

		api.GET("/listings", func(c *gin.Context) {
			c.JSON(http.StatusOK, listings)
		})

		api.GET("/listings/:id", func(c *gin.Context) {
			id, err := strconv.Atoi(c.Param("id"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
				return
			}
			for _, item := range listings {
				if item.ID == id {
					c.JSON(http.StatusOK, item)
					return
				}
			}
			c.JSON(http.StatusNotFound, gin.H{"error": "Listing not found"})
		})

		api.POST("/listings", func(c *gin.Context) {
			var newListing Listing
			if err := c.ShouldBindJSON(&newListing); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			newListing.ID = nextID
			nextID++
			listings = append(listings, newListing)
			c.JSON(http.StatusCreated, newListing)
		})

		api.PUT("/listings/:id", func(c *gin.Context) {
			id, err := strconv.Atoi(c.Param("id"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
				return
			}
			var updatedListing Listing
			if err := c.ShouldBindJSON(&updatedListing); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			for i, item := range listings {
				if item.ID == id {
					updatedListing.ID = id
					listings[i] = updatedListing
					c.JSON(http.StatusOK, updatedListing)
					return
				}
			}
			c.JSON(http.StatusNotFound, gin.H{"error": "Listing not found"})
		})

		api.DELETE("/listings/:id", func(c *gin.Context) {
			id, err := strconv.Atoi(c.Param("id"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
				return
			}
			for i, item := range listings {
				if item.ID == id {
					listings = append(listings[:i], listings[i+1:]...)
					c.JSON(http.StatusOK, gin.H{"message": "Listing deleted successfully"})
					return
				}
			}
			c.JSON(http.StatusNotFound, gin.H{"error": "Listing not found"})
		})
	}

	r.Run(":8080")
}