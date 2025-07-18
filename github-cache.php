<?php
/**
 * GitHub Projects Cache System
 * Caches GitHub API responses to improve performance and avoid rate limits
 */

class GitHubCache {
    private $cacheDir = 'cache/';
    private $cacheFile = 'github_projects.json';
    private $cacheTime = 3600; // 1 hour in seconds
    private $token;
    private $projectLinks;
    
    public function __construct($projectLinks, $token = null) {
        $this->projectLinks = $projectLinks;
        $this->token = $token;
        
        // Create cache directory if it doesn't exist
        if (!file_exists($this->cacheDir)) {
            mkdir($this->cacheDir, 0755, true);
            
            // Create .htaccess to protect cache directory
            $htaccess = $this->cacheDir . '.htaccess';
            if (!file_exists($htaccess)) {
                file_put_contents($htaccess, "Deny from all\n");
            }
        }
    }
    
    /**
     * Get projects with caching
     */
    public function getProjects() {
        $cacheFilePath = $this->cacheDir . $this->cacheFile;
        
        // Check if cache exists and is still valid
        if ($this->isCacheValid($cacheFilePath)) {
            return $this->getFromCache($cacheFilePath);
        }
        
        // Fetch fresh data from GitHub
        $projects = $this->fetchFromGitHub();
        
        // Save to cache
        if (!empty($projects)) {
            $this->saveToCache($cacheFilePath, $projects);
        }
        
        return $projects;
    }
    
    /**
     * Check if cache is valid
     */
    private function isCacheValid($filePath) {
        if (!file_exists($filePath)) {
            return false;
        }
        
        $fileAge = time() - filemtime($filePath);
        return $fileAge < $this->cacheTime;
    }
    
    /**
     * Get data from cache
     */
    private function getFromCache($filePath) {
        $content = file_get_contents($filePath);
        $data = json_decode($content, true);
        
        // Add cache info
        if (is_array($data)) {
            return [
                'projects' => $data,
                'cached' => true,
                'cache_age' => time() - filemtime($filePath)
            ];
        }
        
        return ['projects' => [], 'cached' => false];
    }
    
    /**
     * Save data to cache
     */
    private function saveToCache($filePath, $data) {
        $json = json_encode($data, JSON_PRETTY_PRINT);
        file_put_contents($filePath, $json);
    }
    
    /**
     * Fetch specific repository
     */
    private function fetchRepository($url) {
        $options = [
            'http' => [
                'method' => 'GET',
                'header' => [
                    'User-Agent: PHP Portfolio Script',
                    'Accept: application/vnd.github.v3+json'
                ],
                'timeout' => 10
            ]
        ];
        
        // Add authentication if token is provided
        if ($this->token) {
            $options['http']['header'][] = "Authorization: token {$this->token}";
        }
        
        $context = stream_context_create($options);
        
        try {
            $response = @file_get_contents($url, false, $context);
            
            if ($response === false) {
                return null;
            }
            
            $repo = json_decode($response, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                return null;
            }
            
            // Get languages with a separate request (cached per repo)
            $languages = $this->getRepoLanguages($repo['languages_url']);
            
            $project = [
                'name' => $repo['name'],
                'description' => $repo['description'] ?? 'No description available',
                'url' => $repo['html_url'],
                'homepage' => $repo['homepage'] ?? null,
                'languages' => !empty($languages) ? implode(', ', array_slice($languages, 0, 5)) : 'N/A',
                'stars' => $repo['stargazers_count'],
                'forks' => $repo['forks_count'],
                'watchers' => $repo['watchers_count'],
                'created_at' => $repo['created_at'],
                'updated_at' => $repo['updated_at'],
                'size' => $repo['size'],
                'is_fork' => $repo['fork'],
                'topics' => $repo['topics'] ?? []
            ];
            
            // Add additional metadata
            if (!empty($repo['topics'])) {
                $project['topics_string'] = implode(', ', $repo['topics']);
            }
            
            return $project;
            
        } catch (Exception $e) {
            error_log('GitHub API Error for ' . $url . ': ' . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Fetch projects from GitHub API
     */
    private function fetchFromGitHub() {
        $projects = [];
        
        foreach ($this->projectLinks as $link) {
            $project = $this->fetchRepository($link);
            if ($project !== null) {
                $projects[] = $project;
            }
        }
        
        // Sort by stars + forks for relevance
        usort($projects, function($a, $b) {
            $scoreA = $a['stars'] + $a['forks'];
            $scoreB = $b['stars'] + $b['forks'];
            return $scoreB - $scoreA;
        });
        
        return $projects;
    }
    
    /**
     * Get languages for a specific repository
     */
    private function getRepoLanguages($languagesUrl) {
        // Simple cache for languages based on repo URL
        $cacheKey = md5($languagesUrl);
        $languageCacheFile = $this->cacheDir . 'lang_' . $cacheKey . '.json';
        
        // Check language cache (valid for 1 week)
        if (file_exists($languageCacheFile) && (time() - filemtime($languageCacheFile) < 604800)) {
            $content = file_get_contents($languageCacheFile);
            $languages = json_decode($content, true);
            if (is_array($languages)) {
                return array_keys($languages);
            }
        }
        
        // Fetch languages
        $options = [
            'http' => [
                'method' => 'GET',
                'header' => [
                    'User-Agent: PHP Portfolio Script',
                    'Accept: application/vnd.github.v3+json'
                ],
                'timeout' => 5
            ]
        ];
        
        if ($this->token) {
            $options['http']['header'][] = "Authorization: token {$this->token}";
        }
        
        $context = stream_context_create($options);
        $response = @file_get_contents($languagesUrl, false, $context);
        
        if ($response !== false) {
            $languagesData = json_decode($response, true);
            if (is_array($languagesData)) {
                // Cache the result
                file_put_contents($languageCacheFile, $response);
                return array_keys($languagesData);
            }
        }
        
        return [];
    }
    
    /**
     * Clear cache
     */
    public function clearCache() {
        $files = glob($this->cacheDir . '*.json');
        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file);
            }
        }
        return true;
    }
    
    /**
     * Get cache statistics
     */
    public function getCacheStats() {
        $cacheFilePath = $this->cacheDir . $this->cacheFile;
        
        if (!file_exists($cacheFilePath)) {
            return [
                'exists' => false,
                'message' => 'No cache file found'
            ];
        }
        
        $fileSize = filesize($cacheFilePath);
        $fileAge = time() - filemtime($cacheFilePath);
        $content = file_get_contents($cacheFilePath);
        $data = json_decode($content, true);
        $projectCount = is_array($data) ? count($data) : 0;
        
        return [
            'exists' => true,
            'size' => $this->formatBytes($fileSize),
            'age' => $this->formatTime($fileAge),
            'projects' => $projectCount,
            'expires_in' => $this->formatTime(max(0, $this->cacheTime - $fileAge)),
            'is_expired' => $fileAge >= $this->cacheTime
        ];
    }
    
    /**
     * Format bytes to human readable
     */
    private function formatBytes($bytes, $precision = 2) {
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, $precision) . ' ' . $units[$i];
    }
    
    /**
     * Format time to human readable
     */
    private function formatTime($seconds) {
        if ($seconds < 60) {
            return $seconds . ' seconds';
        } elseif ($seconds < 3600) {
            return round($seconds / 60) . ' minutes';
        } else {
            return round($seconds / 3600, 1) . ' hours';
        }
    }
}

// Usage in get_github_projects.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Configuration
$github_token = ''; // Optional: Add your GitHub personal access token

// Liste des projets à afficher
$projectLinks = [
    "https://api.github.com/repos/Nyx-Off/honeypot-dashboard",
    "https://api.github.com/repos/Nyx-Off/CyberNet-Portfolio",
    "https://api.github.com/repos/Nyx-Off/NyxLabs-QR-Suite",
    "https://api.github.com/repos/Nyx-Off/CryptoForge",
    "https://api.github.com/repos/Nyx-Off/DiceRoll",
    "https://api.github.com/repos/Nyx-Off/CyberFeedBot",
    "https://api.github.com/repos/Nyx-Off/ICalendarManager",
    "https://api.github.com/repos/Nyx-Off/MyTeams",
    "https://api.github.com/repos/Nyx-Off/AceVenturaTheGame",
    "https://api.github.com/repos/Nyx-Off/OptiMots-SEO",
    "https://api.github.com/repos/Nyx-Off/GameOfLife",
    "https://api.github.com/repos/Nyx-Off/Breakout-Game",
    "https://api.github.com/repos/Nyx-Off/Command-Runner",
    "https://api.github.com/repos/Nyx-Off/CustomFonts",
    "https://api.github.com/repos/Nyx-Off/GanttFlow",
];

// Initialize cache
$cache = new GitHubCache($projectLinks, $github_token);

// Handle cache clear request
if (isset($_GET['clear_cache']) && $_GET['clear_cache'] === 'true') {
    $cache->clearCache();
    echo json_encode(['success' => true, 'message' => 'Cache cleared']);
    exit;
}

// Handle cache stats request
if (isset($_GET['cache_stats']) && $_GET['cache_stats'] === 'true') {
    echo json_encode($cache->getCacheStats());
    exit;
}

// Get projects
$result = $cache->getProjects();

// Output based on result type
if (is_array($result) && isset($result['projects'])) {
    // Result from cache system with metadata
    echo json_encode($result['projects']);
} else {
    // Direct result
    echo json_encode($result);
}
