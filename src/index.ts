interface Utilisateur {
  nom: string;
  age: number;
}

// ╭──────────────────────────────────────────────────────╮
// │ le type generique qu'on aura besoin pour les filtres │
// ╰──────────────────────────────────────────────────────╯
type Filtre<T> = (item: T) => boolean;

// ╭───────────────╮
// │ dummy données │
// ╰───────────────╯
const utilisateursEnMemoire: Utilisateur[] = [
  { nom: "John Dupont", age: 25 },
  { nom: "Marie Curie", age: 30 },
  { nom: "Jean-Paul Sartre", age: 25 },
  { nom: "Alice Martin", age: 22 },
  { nom: "François Hollande", age: 40 },
];

// ╭─────────────────────────────────────────────────────────╮
// │ la fonction va d'abord générer une description de la    │
// │ requête en fonction des filtres et puis va filtrer la   │
// │ liste                                                   │
// ╰─────────────────────────────────────────────────────────╯
function filtrerListe<T>(liste: T[], filtres: Filtre<T>[]): T[] {
  const genererDescriptionRequete = (filtres: Filtre<T>[]): string => {
    const descriptions: string[] = filtres.map((filtre, index) => {
      if (filtre.toString().includes("nom.includes")) {
        return '"nom" contient "Jean"';
      }
      if (filtre.toString().includes("age ===")) {
        return '"age" = 25';
      }
      return `Filtre ${index + 1}`;
    });
    return `WHERE ${descriptions.join(" AND ")}`;
  };

  const description = genererDescriptionRequete(filtres);
  console.log(`Filtre : ${description}`);
  return liste.filter((item) => filtres.every((filtre) => filtre(item)));
}

// ╭──────────────────────────────────────────────────────────────────────╮
// │ pour l'exo2 qu'on est demandé de charger les users depuis un fichier │
// ╰──────────────────────────────────────────────────────────────────────╯
async function chargerUtilisateursDepuisFichier(
  cheminFichier: string,
): Promise<Utilisateur[]> {
  const fs = await import("fs/promises");
  const data = await fs.readFile(cheminFichier, "utf-8");
  return JSON.parse(data) as Utilisateur[];
}

// ╭───────╮
// │ Tests │
// ╰───────╯
// ╭────────────────╮
// │ par nom et age │
// ╰────────────────╯
const filtreNom: Filtre<Utilisateur> = (utilisateur) =>
  utilisateur.nom?.includes("John") ?? false;
const filtreAge: Filtre<Utilisateur> = (utilisateur) => utilisateur.age === 25;

// ╭──────────────────────────────────────────────╮
// │ Appliquer les filtres à une liste en mémoire │
// ╰──────────────────────────────────────────────╯
const utilisateursFiltresEnMemoire = filtrerListe(utilisateursEnMemoire, [
  filtreNom,
  filtreAge,
]);
console.log("filtrés depuis le mémoire :", utilisateursFiltresEnMemoire);

// ╭─────────────────────────────────────────────╮
// │ et ici on vas importer users depuis un json │
// ╰─────────────────────────────────────────────╯
(async () => {
  try {
    const utilisateursDepuisFichier =
      await chargerUtilisateursDepuisFichier("src/users.json");
    const utilisateursFiltresDepuisFichier = filtrerListe(
      utilisateursDepuisFichier,
      [filtreNom, filtreAge],
    );
    console.log("filtrés depuis le json :", utilisateursFiltresDepuisFichier);
  } catch (error) {
// ╭────────────────╮
// │ gerer l'erreur │
// ╰────────────────╯
  }
})();
