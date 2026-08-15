const CATEGORY_MAP = {
  patterns: {
    indexFile: 'design-patterns.html',
    subcategories: {
      creational: {
        indexFile: 'design-patterns.html'
      },
      structural: {
        indexFile: 'design-patterns.html'
      },
      behavioral: {
        indexFile: 'design-patterns.html'
      }
    }
  },
  test: {
    indexFile: 'testing.html',
    subcategories: {}
  },
  'data-structures': {
    indexFile: 'structures.html',
    subcategories: {}
  },
  performance: {
    indexFile: 'performance.html',
    subcategories: {}
  }
};

function getCategoryConfig(topic) {
  const categoryConfig = CATEGORY_MAP[topic.category];

  if (!categoryConfig) {
    throw new Error(`Categoría no configurada: ${topic.category}`);
  }

  const subcategoryConfig = topic.subcategory
    ? categoryConfig.subcategories?.[topic.subcategory]
    : null;

  if (topic.subcategory && !subcategoryConfig) {
    throw new Error(`Subcategoría no configurada: ${topic.category}/${topic.subcategory}`);
  }

  return {
    ...categoryConfig,
    ...(subcategoryConfig || {}),
    hasSubcategory: Boolean(topic.subcategory),
    postDirectory: topic.subcategory || ''
  };
}

module.exports = {
  CATEGORY_MAP,
  getCategoryConfig
};
