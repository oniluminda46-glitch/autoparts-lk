package main

import "fmt"

type Part struct {
	Name     string
	PriceLKR float64
}

func main() {
	fmt.Println("=== 01: Go Basics - AutoParts LK Practice ===")
	inventory := []Part{
		{Name: "Aqua Front Bumper", PriceLKR: 45000},
		{Name: "Civic LED Headlight", PriceLKR: 85000},
		{Name: "Brake Pads Set", PriceLKR: 12500},
	}

	for idx, item := range inventory {
		fmt.Printf("[%d] Item: %-22s | Price: LKR %.2f\n", idx+1, item.Name, item.PriceLKR)
	}
}