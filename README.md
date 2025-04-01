# Bound: A Sex-Positive Social Media Platform

## Overview
**Bound** is an inclusive, privacy-first, and kink-aware platform designed to build authentic connections, foster learning, and provide a respectful community.

---

## Features
- **User Profiles**: Privacy controls and customizable profiles.
- **Content Creation**: Text, media, polls, and collaborative posts.
- **Groups & Events**: Public, private, and secret groups with advanced event management.
- **Advanced Moderation**: Tag-based filtering, reporting tools, and AI-assisted features.

---

## Project Structure
Below is the initial file structure for the project:

\\\mermaid
graph TD;
    Bound["Bound Project Root"]
    Bound --> client["client/ (Frontend React)"]
    Bound --> server["server/ (Backend Node.js)"]
    Bound --> dev-setup["dev-setup/ (Development Setup)"]

    client --> src["src/"]
    src --> components["components/ (Reusable UI Components)"]
    src --> pages["pages/ (Page Components)"]
    src --> api["api/ (API Configurations)"]
    src --> redux["redux/ (State Management)"]

    server --> src_server["src/"]
    src_server --> controllers["controllers/ (Business Logic)"]
    src_server --> models["models/ (Database Models)"]
    src_server --> routes["routes/ (API Routes)"]

    dev-setup --> setup_ps1["setup.ps1 (Setup Script)"]
\\\

---

## Development Setup
For instructions on setting up the development environment, navigate to the dev-setup folder. 

---

## Getting Started
1. Clone this repository into your desired directory:
   \\\ash
   git clone <repository-url> D:\MEGA\MEGAsync\GitHub\Bound
   cd Bound
   \\\

2. Run the setup script to initialize the project:
   \\\powershell
   dev-setup\setup.ps1
   \\\

3. Start coding and building features!
