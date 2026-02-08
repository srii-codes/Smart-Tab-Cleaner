// Categories definition (customize as needed)
const CATEGORIES = {
  'Work': ['gmail', 'outlook', 'slack', 'notion', 'asana', 'trello', 'zoom', 'meet.google'],
  'Social': ['facebook', 'twitter', 'instagram', 'linkedin', 'reddit', 'tiktok'],
  'Entertainment': ['youtube', 'netflix', 'spotify', 'twitch', 'disney'],
  'Shopping': ['amazon', 'flipkart', 'ebay', 'myntra', 'ajio'],
  'Education': ['coursera', 'udemy', 'khan', 'edx', 'stackoverflow', 'github'],
  'News': ['news', 'bbc', 'cnn', 'times', 'hindu', 'ndtv'],
};

// Time threshold for "old" tabs (7 days in milliseconds)
const OLD_TAB_THRESHOLD = 7 * 24 * 60 * 60 * 1000;

// Get all tabs and analyze
chrome.tabs.query({}, function(tabs) {
  
  // Group tabs by domain
  const tabsByDomain = {};
  const tabsByCategory = {};
  const oldTabs = [];
  const selectedTabs = new Set();
  
  tabs.forEach(tab => {
    try {
      const url = new URL(tab.url);
      const domain = url.hostname.replace('www.', '');
      
      // Group by domain (for duplicates)
      if (!tabsByDomain[domain]) {
        tabsByDomain[domain] = [];
      }
      tabsByDomain[domain].push(tab);
      
      // Categorize
      let category = 'Other';
      for (const [cat, keywords] of Object.entries(CATEGORIES)) {
        if (keywords.some(keyword => domain.includes(keyword))) {
          category = cat;
          break;
        }
      }
      
      if (!tabsByCategory[category]) {
        tabsByCategory[category] = [];
      }
      tabsByCategory[category].push(tab);
      
      // Check if old (Note: Chrome doesn't track "when tab was opened" 
      // so we use lastAccessed as proxy)
      if (tab.lastAccessed) {
        const daysSinceAccess = (Date.now() - tab.lastAccessed) / (24 * 60 * 60 * 1000);
        if (daysSinceAccess > 7) {
          oldTabs.push(tab);
        }
      }
      
    } catch (e) {
      // Skip invalid URLs (like chrome:// pages)
    }
  });
  
  // Find duplicates
  const duplicates = {};
  let duplicateCount = 0;
  for (const [domain, domainTabs] of Object.entries(tabsByDomain)) {
    if (domainTabs.length > 1) {
      duplicates[domain] = domainTabs;
      duplicateCount += domainTabs.length - 1;
    }
  }
  
  // Update stats
 document.getElementById('stats').textContent = 
  `${tabs.length} total tabs | ${duplicateCount} duplicates | ${oldTabs.length} old tabs`;
  // Render Duplicates
  if (Object.keys(duplicates).length > 0) {
    document.getElementById('duplicates-section').style.display = 'block';
    document.getElementById('close-duplicates').style.display = 'block';
    
    let html = '';
    for (const [domain, domainTabs] of Object.entries(duplicates)) {
      html += `
        <div class="category-group">
          <div class="category-name">
            ${domain}
            <span class="duplicate-count">${domainTabs.length} tabs</span>
          </div>
      `;
      
      domainTabs.forEach((tab, index) => {
        html += `
          <div class="tab-item">
            <input type="checkbox" data-tab-id="${tab.id}" ${index > 0 ? 'checked' : ''}>
            <img src="${tab.favIconUrl || 'icon1.png'}" onerror="this.src='icon1.png'">
            <span>${tab.title.substring(0, 40)}${tab.title.length > 40 ? '...' : ''}</span>
          </div>
        `;
      });
      
      html += '</div>';
    }
    document.getElementById('duplicates-list').innerHTML = html;
  }
  
  // Render Old Tabs
  if (oldTabs.length > 0) {
    document.getElementById('old-tabs-section').style.display = 'block';
    document.getElementById('close-old').style.display = 'block';
    
    let html = '';
    oldTabs.forEach(tab => {
      const daysSinceAccess = Math.floor((Date.now() - tab.lastAccessed) / (24 * 60 * 60 * 1000));
      html += `
        <div class="tab-item old-tab">
          <input type="checkbox" data-tab-id="${tab.id}" checked>
          <img src="${tab.favIconUrl || 'icon1.png'}" onerror="this.src='icon1.png'">
          <span>${tab.title.substring(0, 30)}... (${daysSinceAccess} days)</span>
        </div>
      `;
    });
    document.getElementById('old-tabs-list').innerHTML = html;
  }
  
  // Render Categories
  let catHTML = '';
  for (const [category, categoryTabs] of Object.entries(tabsByCategory)) {
    catHTML += `
      <div class="category-group">
        <div class="category-name">${category} (${categoryTabs.length})</div>
    `;
    
    categoryTabs.forEach(tab => {
      catHTML += `
        <div class="tab-item">
          <input type="checkbox" data-tab-id="${tab.id}">
          <img src="${tab.favIconUrl || 'icon1.png'}" onerror="this.src='icon1.png'">
          <span>${tab.title.substring(0, 40)}${tab.title.length > 40 ? '...' : ''}</span>
        </div>
      `;
    });
    
    catHTML += '</div>';
  }
  document.getElementById('categories-list').innerHTML = catHTML;
  
  // Event Listeners
  
  // Close duplicates (keep first, close rest)
  document.getElementById('close-duplicates')?.addEventListener('click', () => {
    const tabsToClose = [];
    for (const [domain, domainTabs] of Object.entries(duplicates)) {
      // Keep first tab, close others
      for (let i = 1; i < domainTabs.length; i++) {
        tabsToClose.push(domainTabs[i].id);
      }
    }
    chrome.tabs.remove(tabsToClose, () => window.close());
  });
  
  // Close old tabs
  document.getElementById('close-old')?.addEventListener('click', () => {
    const tabIds = oldTabs.map(tab => tab.id);
    chrome.tabs.remove(tabIds, () => window.close());
  });
  
  // Close selected tabs
  document.getElementById('close-selected').addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const tabIds = Array.from(checkboxes).map(cb => parseInt(cb.dataset.tabId));
    if (tabIds.length > 0) {
      if (confirm(`Close ${tabIds.length} tabs?`)) {
        chrome.tabs.remove(tabIds, () => window.close());
      }
    } else {
      alert('No tabs selected!');
    }
  });
  
});
