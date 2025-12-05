<script lang="ts">
  import { marked } from 'marked';

  interface Prompt {
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    prompt: string;
  }

  let {
    prompts,
    categories,
    categoryLabels,
  }: {
    prompts: Prompt[];
    categories: string[];
    categoryLabels: Record<string, string>;
  } = $props();

  // Configure marked for simple inline rendering
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  function renderMarkdown(text: string): string {
    return marked.parse(text) as string;
  }

  let search = $state('');
  let activeCategory = $state<string | null>(null);
  let copiedId = $state<string | null>(null);

  const filteredPrompts = $derived(() => {
    let result = prompts;

    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    return result;
  });

  async function copyPrompt(prompt: Prompt) {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      copiedId = prompt.id;
      setTimeout(() => {
        copiedId = null;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  function toggleCategory(category: string) {
    activeCategory = activeCategory === category ? null : category;
  }
</script>

<div class="prompt-search">
  <!-- Search input -->
  <div class="search-box">
    <input
      type="text"
      placeholder="Prompts durchsuchen..."
      bind:value={search}
    />
  </div>

  <!-- Category filters -->
  <div class="filters">
    {#each categories as category}
      <button
        class="filter-btn"
        class:active={activeCategory === category}
        onclick={() => toggleCategory(category)}
      >
        {categoryLabels[category]}
      </button>
    {/each}
  </div>

  <!-- Results -->
  <div class="prompt-grid">
    {#each filteredPrompts() as prompt (prompt.id)}
      <div class="prompt-card">
        <div class="prompt-header">
          <span class="category-badge">{categoryLabels[prompt.category]}</span>
          <h3>{prompt.title}</h3>
          <p>{prompt.description}</p>
        </div>

        <div class="prompt-content">
          <div class="markdown-content">{@html renderMarkdown(prompt.prompt)}</div>
        </div>

        <div class="prompt-footer">
          <div class="tags">
            {#each prompt.tags as tag}
              <span class="tag">{tag}</span>
            {/each}
          </div>

          <button
            class="copy-btn"
            class:copied={copiedId === prompt.id}
            onclick={() => copyPrompt(prompt)}
          >
            {copiedId === prompt.id ? 'Kopiert!' : 'Kopieren'}
          </button>
        </div>
      </div>
    {/each}
  </div>

  {#if filteredPrompts().length === 0}
    <p class="empty">Keine Prompts gefunden.</p>
  {/if}
</div>

<style>
  .prompt-search {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .search-box input {
    width: 100%;
    max-width: 400px;
    padding: var(--space-3) var(--space-4);
    font-size: var(--text-base);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-bg);
    color: var(--color-text);
  }

  .search-box input:focus {
    outline: none;
    border-color: var(--color-text-muted);
  }

  .filters {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .filter-btn {
    padding: var(--space-2) var(--space-4);
    font-size: var(--text-sm);
    font-weight: 500;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    background: var(--color-bg);
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .filter-btn:hover {
    border-color: var(--color-text-muted);
  }

  .filter-btn.active {
    background: var(--color-text);
    color: var(--color-bg);
    border-color: var(--color-text);
  }

  .prompt-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: var(--space-6);
  }

  .prompt-card {
    display: flex;
    flex-direction: column;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    overflow: hidden;
  }

  .prompt-header {
    padding: var(--space-5);
    border-bottom: 1px solid var(--color-border);
  }

  .category-badge {
    display: inline-block;
    font-size: var(--text-xs);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-accent);
    margin-bottom: var(--space-2);
  }

  .prompt-header h3 {
    font-size: var(--text-lg);
    margin-bottom: var(--space-1);
  }

  .prompt-header p {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .prompt-content {
    flex: 1;
    padding: var(--space-4);
    background: var(--color-bg-subtle);
    max-height: 250px;
    overflow-y: auto;
  }

  .prompt-content .markdown-content {
    font-size: var(--text-sm);
    line-height: 1.7;
  }

  .prompt-content .markdown-content p {
    margin: 0 0 0.75em;
  }

  .prompt-content .markdown-content p:last-child {
    margin-bottom: 0;
  }

  .prompt-content .markdown-content ol,
  .prompt-content .markdown-content ul {
    margin: 0.5em 0;
    padding-left: 1.5em;
  }

  .prompt-content .markdown-content li {
    margin-bottom: 0.25em;
  }

  .prompt-content .markdown-content strong {
    color: var(--color-text);
    font-weight: 600;
  }

  .prompt-content .markdown-content code {
    font-family: 'Geist Mono', monospace;
    font-size: 0.875em;
    background: var(--color-bg);
    padding: 0.15em 0.4em;
    border-radius: 4px;
  }

  .prompt-content .markdown-content pre {
    background: var(--color-bg);
    padding: 0.75em 1em;
    border-radius: 6px;
    overflow-x: auto;
    margin: 0.75em 0;
  }

  .prompt-content .markdown-content pre code {
    background: none;
    padding: 0;
  }

  .prompt-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-4) var(--space-5);
    border-top: 1px solid var(--color-border);
  }

  .tags {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .tag {
    font-size: var(--text-xs);
    padding: var(--space-1) var(--space-2);
    background: var(--color-bg-subtle);
    border-radius: var(--radius-full);
    color: var(--color-text-muted);
  }

  .copy-btn {
    padding: var(--space-2) var(--space-4);
    font-size: var(--text-sm);
    font-weight: 500;
    border: none;
    border-radius: var(--radius-md);
    background: var(--color-text);
    color: var(--color-bg);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .copy-btn:hover {
    background: var(--color-text-secondary);
  }

  .copy-btn.copied {
    background: #22c55e;
  }

  .empty {
    text-align: center;
    padding: var(--space-12);
    color: var(--color-text-muted);
  }

  @media (max-width: 640px) {
    .prompt-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
