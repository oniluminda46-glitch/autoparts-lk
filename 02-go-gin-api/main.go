package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

type PartItem struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Price int    `json:"price"`
}

var parts = []PartItem{
	{ID: 1, Name: "Toyota Oil Filter", Price: 3500},
	{ID: 2, Name: "Honda Air Filter", Price: 4200},
}

func main() {
	r := gin.Default()

	r.GET("/api/parts", func(c *gin.Context) {
		c.JSON(http.StatusOK, parts)
	})
	r.Run(":8081")
}