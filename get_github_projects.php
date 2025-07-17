<?php
/**
 * GitHub Projects Fetcher
 * Retrieves specific repositories from GitHub API
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Configuration
$github_token = ''; // Optional: Add your GitHub personal access token for higher rate limits

// Liste des projets à afficher
$projectLinks = [
    "https://api.github.com/repos/Nyx-Off/honeypot-dashboard",
    "https://api.github.com/repos/Nyx-Off/CyberNet-Portfolio",
    "https://api.github.com/repos/Nyx-Off/NyxLabs-QR-Suite",
];

// Function to fetch a single repository
function fetchRepository($url, $token = null) {
    $options = [
        'http' => [
            'method' => 'GET',
            'header' => [
                'User-Agent: PHP Script',
                'Accept: application/vnd.github.v3+json'
            ]
        ]
    ];
    
    // Add authentication if token is provided
    if ($token) {
        $options['http']['header'][] = "Authorization: token {$token}";
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
        
        // Get languages for the repository
        $languages_url = $repo['languages_url'];
        $languages_response = @file_get_contents($languages_url, false, $context);
        $languages = [];
        
        if ($languages_response !== false) {
            $languages_data = json_decode($languages_response, true);
            if (is_array($languages_data)) {
                $languages = array_keys($languages_data);
            }
        }
        
        return [
            'name' => $repo['name'],
            'description' => $repo['description'] ?? 'No description available',
            'url' => $repo['html_url'],
            'languages' => !empty($languages) ? implode(', ', $languages) : 'N/A',
            'stars' => $repo['stargazers_count'],
            'forks' => $repo['forks_count'],
            'updated_at' => $repo['updated_at']
        ];
        
    } catch (Exception $e) {
        error_log('GitHub API Error for ' . $url . ': ' . $e->getMessage());
        return null;
    }
}

// Function to fetch specific GitHub projects
function fetchSpecificProjects($projectLinks, $token = null) {
    $projects = [];
    
    foreach ($projectLinks as $link) {
        $project = fetchRepository($link, $token);
        if ($project !== null) {
            $projects[] = $project;
        }
    }
    
    return $projects;
}

// Fetch and output projects
$projects = fetchSpecificProjects($projectLinks, $github_token);
echo json_encode($projects);