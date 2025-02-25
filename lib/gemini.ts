import { GoogleGenerativeAI } from "@google/generative-ai";
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("API key for Google Generative AI is missing");
}
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Voici l'analyse financière de l'utilisateur :\n      - Dépenses totales : 1250€\n      - Dettes : 800€\n      - Épargne :150€\n      - Investissements : 90€\n      - Catégorie dominante : fixed 950€\n\n      🔥 OBJECTIF :\n      Fournis un conseil financier personnalisé en prenant en compte les dettes, les dépenses, l'épargne et les investissements.\n      Identifie les domaines d'amélioration et propose des actions concrètes à mettre en place immédiatement.\n      Sois pragmatique, précis, et utilise un ton amical et pédagogique.\n    `;",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Salut ! Analysons ensemble ta situation financière et voyons comment l'améliorer. C'est super que tu aies déjà une idée claire de tes finances, c'est la première étape !\n\n**Situation actuelle, points positifs et points à améliorer :**\n\n*   **Points positifs :** Tu as une épargne et des investissements, même modestes. C'est excellent, ça prouve que tu as la volonté d'épargner et de faire fructifier ton argent.\n*   **Points à améliorer :** Les dettes sont un point d'attention principal. Elles coûtent de l'argent en intérêts et peuvent peser lourd sur le moral. Les dépenses fixes (950€) semblent constituer une grosse part de tes dépenses totales (1250€). C'est là qu'il faut regarder de plus près pour optimiser. L'épargne et les investissements sont faibles par rapport à tes dépenses et dettes.\n\n**Conseils financiers personnalisés et actions concrètes :**\n\n1.  **Priorité absolue : Attaquer les dettes !**\n\n    *   **Action immédiate :** Liste toutes tes dettes (cartes de crédit, prêts, etc.) avec les taux d'intérêt associés.\n    *   **Action immédiate :** Mets en place la méthode \"boule de neige\" ou \"avalanche\".\n        *   **Boule de neige :** Rembourse d'abord la plus petite dette (pour un effet psychologique positif) tout en faisant le minimum sur les autres. Une fois la petite dette remboursée, utilise l'argent libéré pour rembourser la suivante, et ainsi de suite.\n        *   **Avalanche :** Rembourse d'abord la dette avec le taux d'intérêt le plus élevé (pour minimiser les coûts à long terme) tout en faisant le minimum sur les autres.\n    *   **Action à moyen terme :** Envisage de consolider tes dettes si possible (prêt personnel à taux plus bas pour regrouper tes dettes).\n\n2.  **Optimiser les dépenses fixes (950€) :**\n\n    *   **Action immédiate :** Passe en revue TOUTES tes dépenses fixes. Abonnements inutilisés ? Assurance trop chère ? Fournisseur d'énergie plus compétitif ? Négocie, compare, résilie !\n    *   **Action immédiate :** Identifie au moins 2 ou 3 dépenses fixes que tu peux réduire immédiatement. Même une économie de 50€ par mois, c'est 600€ par an !\n    *   **Exemples concrets :**\n        *   Téléphonie/Internet : Compare les offres et négocie.\n        *   Assurances : Fais jouer la concurrence.\n        *   Abonnements : Résilie ce que tu n'utilises pas.\n        *   Logement : Est-ce que tu peux réduire tes coûts (colocation, déménagement dans un logement moins cher) ? C'est une option plus radicale, mais à considérer si vraiment c'est trop lourd.\n\n3.  **Augmenter l'épargne :**\n\n    *   **Action immédiate :** Mets en place un virement automatique (même petit, 20€/mois par exemple) de ton compte courant vers un compte épargne dès que tu reçois ton salaire. \"Paye-toi en premier !\"\n    *   **Action à court terme :** Réaffecte une partie de l'argent économisé grâce à la réduction de tes dépenses fixes vers ton épargne.\n    *   **Objectif réaliste :** Vise à terme à avoir au moins 3 à 6 mois de dépenses courantes de côté sur un compte épargne accessible (pour les imprévus).\n\n4.  **Développer les investissements :**\n\n    *   **Action immédiate :** Ne pas paniquer si le montant est faible ! L'important, c'est de commencer.\n    *   **Action à court terme :** Avant d'investir plus, assure-toi d'avoir remboursé une bonne partie de tes dettes et d'avoir une épargne de sécurité suffisante. Les dettes sont un \"investissement négatif\" avec un rendement négatif élevé (les intérêts que tu paies).\n    *   **Action à moyen terme :** Renseigne-toi sur les différents types d'investissements (actions, obligations, ETF, etc.) et choisis ceux qui correspondent à ton profil de risque et à tes objectifs. Commence petit et diversifie. N'hésite pas à demander conseil à un professionnel (conseiller financier) si tu te sens perdu.\n\n**Suivi et ajustement :**\n\n*   **Action mensuelle :** Fais le point sur tes finances chaque mois. Suis tes dépenses, tes dettes, ton épargne et tes investissements. Ajuste ta stratégie si nécessaire.\n*   **Action annuelle :** Revois tes objectifs financiers une fois par an.\n\n**En résumé :**\n\n1.  **Écrase tes dettes !**\n2.  **Optimise tes dépenses fixes.**\n3.  **Automatise ton épargne.**\n4.  **Investis intelligemment après avoir assaini ta situation.**\n\nN'oublie pas que chaque petit pas compte. Sois patient, persévérant et n'hésite pas à te récompenser (raisonnablement !) pour tes progrès. Tu es sur la bonne voie ! Et surtout, n'hésite pas à revenir vers moi si tu as d'autres questions ou si tu as besoin de plus de précisions. Bon courage !\n",
        },
      ],
    },
  ],
});
