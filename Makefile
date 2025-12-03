.PHONY: dev build preview deploy clean

# Development
dev:
	pnpm dev

# Build
build:
	pnpm build

# Preview build locally
preview:
	pnpm preview

# Deploy to Cloudflare Pages
deploy: build
	pnpm exec wrangler pages deploy ./dist

# Clean build artifacts
clean:
	rm -rf dist node_modules/.cache

# Install dependencies
install:
	pnpm install

# Type check
check:
	pnpm exec astro check

# Help
help:
	@echo "Available commands:"
	@echo "  make dev      - Start development server"
	@echo "  make build    - Build for production"
	@echo "  make preview  - Preview production build"
	@echo "  make deploy   - Deploy to Cloudflare Pages"
	@echo "  make clean    - Remove build artifacts"
	@echo "  make check    - Run type checking"
