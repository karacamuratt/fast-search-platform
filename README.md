# Fast Search Platform

High-performance, event-driven search platform built with **NestJS**, **PostgreSQL**, **Elasticsearch**, **Redis**, and **RabbitMQ**.  
Designed to handle **millions of records** and **high-concurrency search traffic** with production-grade patterns.

---

## Overview

**Fast Search Platform** demonstrates how modern backend systems implement:

- Scalable full-text search
- Low-latency caching
- Event-driven indexing
- Async processing with backpressure
- Production-ready infrastructure patterns

This project is intentionally designed as a **portfolio-grade backend system**, not a toy example.

---

## High-Level Architecture

Client
↓
NestJS API
↓
Redis (Read-Through Cache)
↓
Elasticsearch (Search Engine)

PostgreSQL (Source of Truth)
↓
RabbitMQ (Events)
↓
Search Index Worker
↓
Elasticsearch

---

## Key Design Principles

- **PostgreSQL is the single source of truth**
- **Elasticsearch is a derived, eventually consistent index**
- **RabbitMQ decouples write operations from indexing**
- **Redis protects Elasticsearch from hot query bursts**
- **All heavy operations are async & retry-safe**

---

## Core Features

### Advanced Search (Elasticsearch)
- Custom index mappings with:
  - Autocomplete (`edge_ngram`)
  - Multi-field text search
  - Keyword aggregations
- Optimized queries with:
  - `search_after` pagination
  - Controlled shard usage
- Supports millions of indexed documents

### High-Performance Caching (Redis)
- Read-through cache for search endpoints
- Deterministic cache key generation
- TTL-based invalidation
- Protects Elasticsearch during peak traffic

### Event-Driven Indexing (RabbitMQ)
- Topic-based exchange
- Async reindex pipeline
- Manual `ack / nack` handling
- Safe retries without data loss
- Ready for horizontal scaling

### Database Layer (PostgreSQL + Prisma)
- Prisma v7 with `pg` adapter
- Connection pooling
- Large-scale seed support (1M+ records)
- Clean separation between DB entities and search documents

## Tech Stack

| Layer | Technology |
|-----|-----------|
| API | NestJS |
| Database | PostgreSQL |
| ORM | Prisma v7 (adapter-pg) |
| Search | Elasticsearch |
| Cache | Redis |
| Messaging | RabbitMQ |
| Containers | Docker / Docker Compose |
| Language | TypeScript |

---

## Testing Strategy

### Search & API
- Endpoints tested via Postman
- Cache hit/miss behavior verified
- Elasticsearch responses validated

### RabbitMQ
- Producer triggered via API endpoints
- Queue state inspected via RabbitMQ Management UI
- Consumer behavior validated via logs & ES side effects
- Retry behavior tested with forced failures

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- pnpm

### Start Infrastructure

docker-compose up -d

### Install Dependencies

- pnpm install
- pnpm prisma db seed
- pnpm prisma generate
- pnpm es:index
- cd apps/api
- pnpm start:dev
