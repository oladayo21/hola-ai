.PHONY: dev build preview deploy clean slides slides-build dev-worker build-all

# Development
dev:
	pnpm dev

# Build Astro site
build:
	pnpm build

# Build slides
slides-build:
	pnpm slides:build

# Build everything (Astro + Slidev)
build-all: build slides-build

# Preview build locally
preview:
	pnpm preview

# Deploy to Cloudflare Workers (builds everything first)
deploy: build-all
	pnpm dlx wrangler@latest deploy

# Clean build artifacts
clean:
	rm -rf dist node_modules/.cache

# Install dependencies
install:
	pnpm install

# Type check
check:
	pnpm exec astro check

# Slides (Slidev)
slides:
	pnpm slides

# Worker API (for polls)
dev-worker:
	pnpm dev:worker

# Help
help:
	@echo "Available commands:"
	@echo ""
	@echo "  Development:"
	@echo "    make dev          - Start Astro dev server"
	@echo "    make slides       - Start Slidev presentation"
	@echo "    make dev-worker   - Start Worker API (for polls)"
	@echo ""
	@echo "  Build:"
	@echo "    make build        - Build Astro site only"
	@echo "    make slides-build - Build slides only"
	@echo "    make build-all    - Build everything (Astro + Slidev)"
	@echo ""
	@echo "  Deploy:"
	@echo "    make deploy       - Build all and deploy to Cloudflare"
	@echo "    make preview      - Preview production build locally"
	@echo ""
	@echo "  Utility:"
	@echo "    make clean        - Remove build artifacts"
	@echo "    make check        - Run type checking"
	@echo "    make install      - Install dependencies"
