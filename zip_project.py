import os
import zipfile

target_dir = r"C:\Users\user\Desktop\BankingManagement"
output_zip = r"C:\Users\user\Desktop\BankingManagement.zip"

print(f"Creating clean TrainPlex submission zip from: {target_dir}")
print(f"Target archive: {output_zip}")

# Ensure previous zip is removed
if os.path.exists(output_zip):
    os.remove(output_zip)
    print("Removed previous oversized zip.")

excluded_dirs = {'node_modules', 'dist', 'coverage', '.cache'}

file_count = 0
with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as zipf:
    for root, dirs, files in os.walk(target_dir):
        # Prune excluded directories
        dirs[:] = [d for d in dirs if d not in excluded_dirs]
        
        for file in files:
            if file.endswith('.zip'):
                continue
            if file == '.env':  # Do not include real .env in zip
                continue
                
            full_path = os.path.join(root, file)
            # Relative path inside the zip file
            arcname = os.path.relpath(full_path, target_dir)
            zipf.write(full_path, arcname)
            file_count += 1

zip_size_mb = os.path.getsize(output_zip) / (1024 * 1024)
print(f"\nSUCCESS! Created {output_zip}")
print(f"Total files archived: {file_count}")
print(f"Archive Size: {zip_size_mb:.2f} MB")