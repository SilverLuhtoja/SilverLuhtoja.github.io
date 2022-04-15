package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Println("Starting the application on port 3000...")
	http.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir("./"))))
	fmt.Println("http://localhost:3000")
	if err := http.ListenAndServe(":3000", nil); err != nil {
		log.Fatal(err)
	}
}
