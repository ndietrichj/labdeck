#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod git_update;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![check_updates])
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                use std::process::Command;

                let exe = std::env::current_dir()
                    .unwrap()
                    .join("binaries")
                    .join("labdeck-backend-x86_64-pc-windows-msvc.exe");

                Command::new(exe)
                    .env("LABDECK_PORT", "8790")
                    .env("HOMELAB_STATUS_URL", "http://10.0.0.220:8787/public-status.json")
                    .spawn()
                    .expect("failed to launch dev backend");
            }

            #[cfg(not(debug_assertions))]
            {
                use tauri_plugin_shell::ShellExt;

                let _child = app
                    .shell()
                    .sidecar("labdeck-backend")
                    .expect("failed to create backend sidecar")
                    .env("LABDECK_PORT", "8790")
                    .env("HOMELAB_STATUS_URL", "http://10.0.0.220:8787/public-status.json")
                    .spawn()
                    .expect("failed to launch backend");
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn check_updates() -> git_update::GitUpdateStatus {
    git_update::check_git_status()
}
