package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"time"
)

type Post struct {
	ID       int      `json:"id"`
	Title    string   `json:"title"`
	Author   string   `json:"author"`
	Date     string   `json:"date"`
	Category string   `json:"category"`
	ReadTime string   `json:"readTime"`
	Content  string   `json:"content"`
	Tags     []string `json:"tags"`
}

func main() {
	reader := bufio.NewReader(os.Stdin)

	fmt.Println("=== New Post Creator ===")
	fmt.Println()

	fmt.Print("Title: ")
	title, _ := reader.ReadString('\n')
	title = strings.TrimSpace(title)

	fmt.Print("Author: ")
	author, _ := reader.ReadString('\n')
	author = strings.TrimSpace(author)

	fmt.Print("Category: ")
	category, _ := reader.ReadString('\n')
	category = strings.TrimSpace(category)

	fmt.Print("Read time (e.g., 5 min): ")
	readTime, _ := reader.ReadString('\n')
	readTime = strings.TrimSpace(readTime)

	fmt.Print("Tags (comma-separated): ")
	tagsInput, _ := reader.ReadString('\n')
	tagsInput = strings.TrimSpace(tagsInput)

	var tags []string
	if tagsInput != "" {
		for _, t := range strings.Split(tagsInput, ",") {
			t = strings.TrimSpace(t)
			if t != "" {
				tags = append(tags, t)
			}
		}
	}

	fmt.Println()
	fmt.Println("Write your post content (type 'END' on a new line to finish):")
	fmt.Println()

	var lines []string
	for {
		text, _ := reader.ReadString('\n')
		text = strings.TrimSpace(text)
		if text == "END" {
			break
		}
		lines = append(lines, text)
	}

	content := strings.Join(lines, "\n")

	id := int(time.Now().Unix())
	date := time.Now().Format("2006-01-02")

	post := Post{
		ID:       id,
		Title:    title,
		Author:   author,
		Date:     date,
		Category: category,
		ReadTime: readTime,
		Content:  content,
		Tags:     tags,
	}

	data, err := json.MarshalIndent(post, "", "  ")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error marshaling JSON: %v\n", err)
		os.Exit(1)
	}

	filename := fmt.Sprintf("post-%d.json", id)
	err = os.WriteFile(filename, data, 0644)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Println()
	fmt.Printf("✓ Created %s\n", filename)
}
