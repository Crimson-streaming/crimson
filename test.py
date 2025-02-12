import re

# Chemin du fichier HTML
file_path = "test.html"

# Lire le contenu du fichier
with open(file_path, "r", encoding="utf-8") as file:
    content = file.readlines()

# Supprimer les lignes contenant le titre spécifique
new_content = [line for line in content if not re.search(r'<span class="video-item-content">.*?</span>', line)]

# Réécrire le fichier sans ces lignes
with open(file_path, "w", encoding="utf-8") as file:
    file.writelines(new_content)

print("Lignes supprimées avec succès.")
