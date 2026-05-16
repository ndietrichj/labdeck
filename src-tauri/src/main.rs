#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod git_update;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![check_updates])
        .setup(|app| {
            #[cfg(not(debug_assertions))]
            {
                use tauri_plugin_shell::ShellExt;

                let _child = app
                    .shell()
                    .sidecar("labdeck-backend")
                    .expect("failed to create backend sidecar")
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
