# 🎌 Anime Facts Explorer

## 📌 Project Overview

Anime Facts Explorer is a responsive web application that allows users to search for anime and explore detailed information, facts, and related anime dynamically using public APIs. The project focuses on integrating real-time data, building an interactive UI, and ensuring a smooth user experience across devices.

---

## 🎯 Purpose

The main purpose of this project is to:

* Learn how to integrate public APIs into a frontend application
* Practice asynchronous JavaScript using `fetch`
* Dynamically display data on a webpage
* Build a responsive and user-friendly interface
* Prepare a scalable project structure for future feature expansion

---

## 🔗 APIs Used

### 1. Jikan API (Primary)

* Source: MyAnimeList data
* Used for: Anime details, images, ratings, synopsis
* Endpoint Example:

  ```
  https://api.jikan.moe/v4/anime?q=naruto
  ```

### 2. AnimeChan API (Secondary)

* Used for: Anime quotes (treated as facts)
* Endpoint Example:

  ```
  https://api.animechan.io/v1/quotes/random?anime=naruto
  ```

### 3. Kitsu API (Supplementary)

* Used for: Related anime suggestions
* Endpoint Example:

  ```
  https://kitsu.io/api/edge/anime?filter[text]=naruto
  ```

---

## 🚀 Project Goal

To integrate and display real-time anime data from public APIs in an interactive and responsive web interface.

---

## ✅ Planned Features

### 🔍 Core Features

* Search anime by name
* Display anime details (image, title, rating, episodes)
* Show anime synopsis (used as facts)
* Fetch and display anime quotes

### 🔄 Dynamic Features

* Display related anime suggestions
* Dynamic content rendering using JavaScript
* Loading state during API calls
* Error handling for invalid inputs

### 📱 UI/UX Features

* Fully responsive design (mobile, tablet, desktop)
* Card-based layout
* Clean and modern interface

---

## Feature added on Milestone 3

* 🔎 Search suggestions / autocomplete
* ❤️ Save favorite anime (localStorage)
* 🌙 Dark mode toggle
* 🔃 Sorting and filtering (rating, popularity)
* 📜 Pagination for results


---

## 🛠️ Technologies Used

* **HTML5** – Structure of the webpage
* **CSS3** – Styling and responsive design
* **JavaScript (ES6)** – Logic and API handling
* **Fetch API** – Making HTTP requests

---

## ⚙️ How It Works

1. User enters an anime name
2. JavaScript sends a request to the Jikan API
3. Anime details are displayed dynamically
4. Additional APIs fetch quotes and related anime
5. UI updates in real-time with loading and error states

---

## 📂 Project Structure

```
project-folder/
│── index.html
│── style.css
│── script.js
│── README.md
```

---

## ▶️ How to Run the Project

1. Download or clone the repository:

   ```bash
   git clone https://github.com/your-username/anime-facts-explorer.git
   ```

2. Open the project folder

3. Run `index.html` in your browser
   (Recommended: Use Live Server in VS Code)

---

## 📦 Deliverables

* API integration using `fetch`
* Dynamic display of data
* Loading state handling
* Responsive UI design

---

## 💡 Important Notes

* This milestone focuses on planning and clarity of the idea
* The project is designed to be feasible within the given timeline
* The system supports future features like search, filtering, and sorting

---

## 📌 Conclusion

Anime Facts Explorer demonstrates how multiple public APIs can be combined to build an interactive frontend application. It highlights real-time data handling, dynamic UI updates, and responsive design — forming a strong foundation for further development.

---

⭐ If you like this project, consider giving it a star!
