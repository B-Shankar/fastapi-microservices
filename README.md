# fastapi-microservices

# Inventory & Payment Management System

A modern microservices-based application for managing inventory and payment operations with real-time data synchronization.

## 🏗️ Architecture Overview

This system follows a microservices architecture pattern with the following components:

- **Frontend**: React-based web application providing user interface
- **Inventory Service**: FastAPI microservice handling product and inventory management
- **Payment Service**: FastAPI microservice managing payment processing and transactions
- **Redis**: Used for caching (RedisJSON) and real-time streaming (Redis Streams)

## 🔧 Tech Stack

### Frontend
- **React** - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server

### Backend Services
- **FastAPI** - High-performance Python web framework for APIs
- **SQLModel** - Modern SQL toolkit with Pydantic integration

### Data & Caching
- **Redis** - In-memory data store for caching and streaming
- **RedisJSON** - JSON document storage in Redis
- **Redis Streams** - Real-time data streaming between services

## 🚀 Features

- **Inventory Management**: Create, read, update, and delete products
- **Payment Processing**: Handle transactions and payment operations
- **Real-time Synchronization**: Services communicate via Redis Streams
- **Caching Layer**: Improved performance with Redis caching
- **Responsive UI**: Modern React interface with light/dark theme support
- **Authentication**: Secure user authentication system

## 📡 Service Communication

- **Frontend ↔ Services**: Direct API calls to both Inventory and Payment services
- **Inter-service Communication**: Internal API calls between Inventory and Payment services
- **Data Synchronization**: Redis Streams enable real-time updates between services
- **Caching**: RedisJSON stores frequently accessed data for improved performance
