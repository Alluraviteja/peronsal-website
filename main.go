package main

import (
	"html/template"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

type PageData struct {
	Name    string
	Title   string
	Tagline string
}

var tmpl *template.Template

func init() {
	var paths []string
	_ = filepath.WalkDir("templates", func(path string, d fs.DirEntry, err error) error {
		if err == nil && !d.IsDir() && filepath.Ext(path) == ".html" {
			paths = append(paths, path)
		}
		return nil
	})
	tmpl = template.Must(template.ParseFiles(paths...))
}

var defaultData = PageData{
	Name:    "Raviteja",
	Title:   "Software Engineer",
	Tagline: "Building reliable systems and clean interfaces.",
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	if err := tmpl.ExecuteTemplate(w, "index.html", defaultData); err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		log.Printf("template error: %v", err)
	}
}

func rateLimiterHandler(w http.ResponseWriter, r *http.Request) {
	if err := tmpl.ExecuteTemplate(w, "rate-limiter.html", defaultData); err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		log.Printf("template error: %v", err)
	}
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	mux.HandleFunc("/projects/rate-limiter", rateLimiterHandler)
	mux.HandleFunc("/", indexHandler)

	log.Printf("listening on http://localhost:%s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal(err)
	}
}
