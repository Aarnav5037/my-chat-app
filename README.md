📊 Database Optimization Recommender System

🚀 Overview

This project is a Database Optimization Recommender System built for a hackathon. It intelligently analyzes query workloads, execution plans, and database metadata to provide specific, actionable optimization recommendations. Unlike generic tips from a standard LLM, our system builds context across multiple queries and uses a combination of rule-based heuristics and an LLM (Mistral 7B) to tailor recommendations for your actual workload.

Additionally, the project features an interactive chatbot interface where users can explore recommendations in real time. The frontend is built with React + Vite + TailwindCSS, while the backend integrates query analysis, heuristic detection, and LLM inference.

✨ Key Features

🧠 Smart Recommendation Engine

Workload Analysis: Extracts information from multiple queries and their execution plans.

Context Building: Correlates metadata and patterns across queries (e.g., index usage, partitioning opportunities).

Hybrid Approach:

Heuristics: Detect common optimization candidates (e.g., SELECT * usage, poor selectivity, missing indexes).

Mistral 7B LLM: Generates detailed, query-specific recommendations instead of generic advice.

Actionable Output: Suggestions include index creation, query rewrites, partitioning strategies, caching, and database tuning tips.

💬 Chatbot AI Interface

Simulates a real-time conversation with the recommender.

Presents LLM-generated recommendations in a structured, readable format (with preserved line breaks).

Supports multiple prompts/responses to mimic ongoing conversation.

🖥️ Frontend

Built using React (19), Vite, and TailwindCSS.

Responsive UI with:

Centered layout and smooth styling via Tailwind.

Chat-like interface where YOU and AI messages are distinguished with color and alignment.

Preserved formatting for multi-line recommendations (whitespace-pre-wrap).

Loading indicator (“AI is typing... 🤖”) for better UX.

⚙️ Backend

Handles parsing of query data, execution plans, and metadata.

Implements heuristic detection logic for optimization candidates.

Integrates with Mistral 7B LLM to enhance recommendations with context-aware details.

Returns structured JSON responses to the frontend.

📑 How It Works

Input Data

Provide a set of queries, execution plans, and metadata.

Context Building

The backend aggregates data across queries to identify patterns.

Heuristic Analysis

Simple rules flag obvious optimizations (e.g., missing indexes, overuse of SELECT *).

LLM Processing

Mistral 7B takes the heuristic output and detailed context to craft specific, workload-aware recommendations.

Chat UI

The frontend displays these recommendations in a conversational format.

🔧 Development Notes

TailwindCSS Setup: Ensure tailwind.config.js exists in the root directory and contains the correct content paths.

Line Breaks: Use Tailwind’s whitespace-pre-wrap class on message containers to preserve \n.

LLM Integration: Replace the simulation JSON with an API call to Mistral 7B for production.

Scalability: The modular backend allows plugging in different LLMs or heuristics.

🌟 Future Enhancements

🔄 Dynamic Query Upload: Allow users to upload workload logs directly.

📊 Visualization: Add query performance graphs and before/after comparisons.

⚡ Real-Time DB Connection: Connect directly to a live database for automated plan extraction.

🔍 Advanced Caching Strategies: Include cost-based analysis for caching decisions.

🤖 Fine-Tuned Models: Experiment with fine-tuning Mistral or other LLMs for even better recommendations.
