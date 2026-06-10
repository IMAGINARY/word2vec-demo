import en from "./en/en";

const corpora = [
  {
    title: {
      en: "Seafood in Spain (English)",
      es: "Marisco en España (Inglés)",
      de: "Meeresfrüchte in Spanien (Englisch)",
      fr: "Fruits de mer en Espagne (Anglais)",
      uk: "Морепродукти в Іспанії (Англійська)",
    },
    language: "en",
    text: `I eat seafood in Spain. I drink coffee in Italy. I eat fish in Japan. I eat pasta in Italy. I drink beer in Germany. I drink tea in Spain. I eat seafood in Japan. I drink coffee in Germany. I eat fish in Italy. I eat pasta in Spain. I drink beer in Japan. I drink tea in Japan.`,
  },

  {
    title: {
      en: "Squirrels in the forest (French)",
      es: "Ardillas en el bosque (Francés)",
      de: "Eichhörnchen im Wald (Französisch)",
      fr: "Écureuils dans la forêt (Français)",
      uk: "Білки в лісі (Французька)",
    },
    language: "fr",
    text: `Je trouve des écureuils dans la forêt. Je vois des crabes sur la plage. Je vois des pies en ville. Je trouve des hérissons à la montagne. Je vois des écureuils à la montagne. Je trouve des moules sur la plage. Je vois des coccinelles dans la forêt. Je trouve des hérissons en ville. Je trouve des coccinelles en ville. Je vois des hérissons à la montagne. Je trouve des pies sur la plage. Je vois des renards dans la forêt.`,
  },

  {
    title: {
      en: "Books in the living room (German)",
      es: "Libros en la sala de estar (Alemán)",
      de: "Bücher im Wohnzimmer (Deutsch)",
      fr: "Livres dans le salon (Allemand)",
      uk: "Книги в вітальні (Німецька)",
    },
    language: "de",
    text: `Ich suche die grünen Bücher im Wohnzimmer. Ich finde die gelben Servietten im Bad. Ich suche die blauen Vasen im Flur. Ich finde die grünen Servietten im Flur. Ich suche die blauen Bücher im Bad. Ich finde die gelben Vasen im Wohnzimmer. Ich suche die roten Kerzen im Schlafzimmer. Ich finde die grünen Kerzen im Bad. Ich suche die blauen Servietten im Wohnzimmer. Ich finde die gelben Bücher im Flur. Ich suche die roten Kerzen im Schlafzimmer. Ich finde die roten Vasen im Schlafzimmer.`,
  },

  {
    title: {
      en: "Tennis on Mondays (Spanish)",
      es: "Tenis los lunes (Español)",
      de: "Tennis am Montag (Spanisch)",
      fr: "Tennis le lundi (Espagnol)",
      uk: "Теніс по понеділках (Іспанська)",
    },
    language: "es",
    text: `Juego al tenis los lunes. Hago natación los martes. Juego al fútbol los miércoles. Juego al tenis los jueves. Juego al baloncesto los viernes. Hago natación los sábados. Hago atletismo los domingos. Juego al fútbol los lunes. Juego al tenis los miércoles. Juego al baloncesto los jueves. Juego al voleibol los viernes. Hago atletismo los sábados.`,
  },

  // {
  //   title: {
  //     en: "Seafood in Spain (French)",
  //     es: "Marisco en España (Francés)",
  //     de: "Meeresfrüchte in Spanien (Französisch)",
  //     fr: "Fruits de mer en Espagne (Français)",
  //     uk: "Морепродукти в Іспанії (Французька)",
  //   },
  //   language: "fr",
  //   text: `Je mange des fruits de mer en Espagne. Je bois du café en Italie. Je mange du poisson au Japon. Je mange des pâtes en Italie. Je bois de la bière en Allemagne. Je bois du thé en Espagne. Je mange des fruits de mer au Japon. Je bois du café en Allemagne. Je mange du poisson en Italie. Je mange des pâtes en Espagne. Je bois de la bière au Japon. Je bois du thé au Japon.`,
  // },
  {
    title: {
      en: "Evening walk (Ukrainian)",
      es: "Paseo nocturno (Ucraniano)",
      de: "Abendspaziergang (Ukrainisch)",
      fr: "Promenade du soir (Ukrainien)",
      uk: "прогулянка ввечері (Українська)",
    },
    language: "uk",
    text: `Вона любить прогулюватися ввечері. Він любить бігати вночі. Вона любить гуляти вранці. Він любить прогулюватися вночі. Вона любить бігати вранці. Він любить плавати ввечері. Вона любить плавати вночі. Він любить гуляти ввечері. Вона любить прогулюватися вдень. Він любить гуляти вдень. Вона любить плавати вдень. Він любить бігати вдень.`,
  },
];

export default corpora;
