package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
)

var tpl *template.Template

func main() {
	fmt.Println("Starting the application on port 8000...")
	http.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir("./"))))
	fmt.Println("http://localhost:8000")
	if err := http.ListenAndServe(":8000", nil); err != nil {
		log.Fatal(err)
	}
}
