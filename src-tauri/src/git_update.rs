use std::process::Command;
use std::env;

#[derive(Debug, Clone, serde::Serialize)]
pub struct GitUpdateStatus {
    pub status: String,
    pub message: String,
}

pub fn check_git_status() -> GitUpdateStatus {
    // Get repo path from environment variable, fallback to hardcoded path
    let repo_path = env::var("LABDECK_REPO_PATH")
        .unwrap_or_else(|_| r"C:\Users\ndiet\source\repos\labdeck".to_string());
    
    // Check if working tree is clean
    match Command::new("git")
        .arg("status")
        .arg("--porcelain")
        .current_dir(&repo_path)
        .output()
    {
        Ok(output) => {
            if !output.stdout.is_empty() {
                return GitUpdateStatus {
                    status: "skipped_dirty".to_string(),
                    message: "Local changes detected, skipping auto-update.".to_string(),
                };
            }
        }
        Err(e) => {
            return GitUpdateStatus {
                status: "failed".to_string(),
                message: format!("Failed to run git status: {}", e),
            };
        }
    }
    
    // Fetch from origin
    match Command::new("git")
        .arg("fetch")
        .arg("origin")
        .current_dir(&repo_path)
        .output()
    {
        Ok(_) => {}
        Err(e) => {
            return GitUpdateStatus {
                status: "failed".to_string(),
                message: format!("Failed to fetch: {}", e),
            };
        }
    }
    
    // Compare HEAD to origin/master
    match Command::new("git")
        .arg("rev-list")
        .arg("--count")
        .arg("HEAD..origin/master")
        .current_dir(&repo_path)
        .output()
    {
        Ok(output) => {
            let output_str = String::from_utf8_lossy(&output.stdout);
            let behind_count: u32 = output_str.trim().parse().unwrap_or(0);
            
            if behind_count == 0 {
                GitUpdateStatus {
                    status: "up_to_date".to_string(),
                    message: "LabDeck is up to date".to_string(),
                }
            } else {
                // Try to pull with --ff-only
                match Command::new("git")
                    .arg("pull")
                    .arg("--ff-only")
                    .arg("origin")
                    .arg("master")
                    .current_dir(&repo_path)
                    .output()
                {
                    Ok(_) => GitUpdateStatus {
                        status: "updated".to_string(),
                        message: "Updated from GitHub. Loading LabDeck...".to_string(),
                    },
                    Err(e) => GitUpdateStatus {
                        status: "failed".to_string(),
                        message: format!("Failed to pull: {}", e),
                    },
                }
            }
        }
        Err(e) => GitUpdateStatus {
            status: "failed".to_string(),
            message: format!("Failed to compare commits: {}", e),
        },
    }
}
