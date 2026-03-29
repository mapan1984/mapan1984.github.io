.PHONY: help install build serve drafts clean publish

help: ## Print this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

install: ## Install Ruby gem dependencies
	bundle install

build: ## Build site to _site/
	bundle exec jekyll build

serve: ## Serve locally at localhost:4000 with live reload
	bundle exec jekyll serve --livereload --baseurl=""

drafts: ## Serve locally including draft posts
	bundle exec jekyll serve --drafts --livereload --baseurl=""

clean: ## Remove build artifacts
	rm -rf _site .jekyll-cache .jekyll-metadata

publish: ## Commit and push to GitHub Pages (master)
	@if [ -z "$$(git status --porcelain)" ]; then \
		echo "Nothing to commit, working tree clean."; \
		exit 0; \
	fi
	@read -p "Commit message: " msg; \
	git add -A && git commit -m "$$msg" && git push origin master
