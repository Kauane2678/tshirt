export type Review = {
  id: number;
  productId: number;
  author: string;
  city: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
  helpful: number;
};

export type Testimonial = {
  id: number;
  author: string;
  city: string;
  avatar: string;
  rating: number;
  body: string;
  product: string;
  productId: number;
};

export const reviews: Review[] = [
  // Produto 1 — Camisa Brasil Home 2024
  {
    id: 1, productId: 1, author: "Lucas Mendonça", city: "São Paulo, SP",
    avatar: "LM", rating: 5, date: "12 Mar 2024", verified: true, helpful: 47,
    title: "Simplesmente perfeita!",
    body: "Comprei para usar no jogo do Brasil e recebi vários elogios. O tecido é muito leve e não abafa. O acabamento está impecável, o escudo bordado é muito bem feito. Chegou em 2 dias, embalagem ótima. Já estou pensando em pedir a away também!",
  },
  {
    id: 2, productId: 1, author: "Amanda Ferreira", city: "Rio de Janeiro, RJ",
    avatar: "AF", rating: 5, date: "8 Mar 2024", verified: true, helpful: 31,
    title: "Melhor camisa que já comprei online",
    body: "Sempre tive medo de comprar camisa de futebol pela internet mas dessa vez fui de cabeça e não me arrependo! A qualidade da tailandesa é absurda. O amarelo é vivo, não desbotou nem um pouco após duas lavagens. Tamanho G ficou perfeito em mim (1,75m, 78kg).",
  },
  {
    id: 3, productId: 1, author: "Rafael Costa", city: "Belo Horizonte, MG",
    avatar: "RC", rating: 4, date: "1 Mar 2024", verified: true, helpful: 18,
    title: "Excelente, só achei um pouco grande",
    body: "A camisa é muito bonita e o material é premium. Só achei que o tamanho M ficou um pouco largo nos ombros — quem for mais magro talvez prefira o P. Fora isso, entrega rápida e qualidade tailandesa de primeira. Recomendo muito!",
  },
  // Produto 4 — Camisa Away Copa
  {
    id: 4, productId: 4, author: "Thiago Oliveira", city: "Curitiba, PR",
    avatar: "TO", rating: 5, date: "20 Fev 2024", verified: true, helpful: 89,
    title: "A camisa mais bonita de todas as Copas",
    body: "Essa camisa entrou para a história do futebol. Eu assisti todos os jogos do Brasil no Qatar com ela e cada vez que coloco lembro daqueles momentos inesquecíveis. A estampa da onça é impressionante ao vivo — na foto não faz jus. Material de altíssima qualidade, não desbotou nada.",
  },
  {
    id: 5, productId: 4, author: "Juliana Santos", city: "Fortaleza, CE",
    avatar: "JS", rating: 5, date: "14 Fev 2024", verified: true, helpful: 62,
    title: "Histórica! Vale muito o investimento",
    body: "Comprei de presente para meu marido que é fanático por futebol. Ele ficou emocionado quando abriu! Disse que é a camisa mais bonita que já teve. O azul é exuberante e a estampa da onça nas mangas é um show à parte. Entrega em 48 horas, tailandesa premium de verdade.",
  },
  // Produto 16 — Retro Ronaldo
  {
    id: 6, productId: 16, author: "Pedro Almeida", city: "Salvador, BA",
    avatar: "PA", rating: 5, date: "25 Jan 2024", verified: true, helpful: 143,
    title: "Emocionou demais, meu pai chorou!",
    body: "Comprei de presente para o meu pai que assistiu a Copa de 1998 do começo ao fim. Quando ele abriu e viu o número 9 do Ronaldo, os olhos encheram d'água. A qualidade da tailandesa é absurda. O tecido, o número flocado, a etiqueta... tudo no capricho. Muito obrigado pela peça incrível!",
  },
  {
    id: 7, productId: 16, author: "Mariana Gomes", city: "Recife, PE",
    avatar: "MG", rating: 5, date: "19 Jan 2024", verified: true, helpful: 97,
    title: "O Fenômeno merece essa homenagem",
    body: "Ronaldo R9 é o maior de todos. Essa camisa representa uma época que o Brasil dominou o futebol mundial. A qualidade está incrível — o número 9 está perfeito, a textura do tecido, o escudo com 4 estrelas... tudo no lugar. Já comprei 3 unidades para dar de presente.",
  },
  // Produto 10 — Preta Dourada
  {
    id: 8, productId: 10, author: "Felipe Nascimento", city: "Brasília, DF",
    avatar: "FN", rating: 5, date: "5 Fev 2024", verified: true, helpful: 56,
    title: "Arte pura. Parece um quadro.",
    body: "Essa camisa é de outro nível. O padrão indígena é simplesmente belíssimo e os detalhes em dourado são incríveis ao vivo. Demorei a pedir por causa do preço mas valeu cada centavo. Chegou em caixa especial com certificado. Já está emoldurada na parede do meu escritório.",
  },
  // Produto 15 — Retro 1998
  {
    id: 9, productId: 15, author: "Carla Medeiros", city: "Porto Alegre, RS",
    avatar: "CM", rating: 5, date: "10 Fev 2024", verified: true, helpful: 74,
    title: "Idêntica à de 1998!",
    body: "Tenho a camisa de 1998 guardada como relíquia e posso confirmar: essa tailandesa é IDÊNTICA. Mesma cor, mesmo corte, mesma posição das listras nas ombeiras. Comprei para usar no dia a dia sem precisar tirar a antiga da caixa. Produto excepcional!",
  },
  // Produto 7 — Jordan Amarela
  {
    id: 10, productId: 7, author: "Bruno Carvalho", city: "Manaus, AM",
    avatar: "BC", rating: 4, date: "28 Jan 2024", verified: true, helpful: 34,
    title: "Diferente de tudo que já vi",
    body: "Jordan + Brasil é uma combinação que não imaginei que iria tão bem. O Jumpman no amarelo canarinho ficou surreal. Uso muito para sair à noite e sempre gera comentários. O único ponto é que o corte é bem slim — quem tem ombros mais largos talvez prefira um tamanho a mais.",
  },
];

// Depoimentos gerais para a home page
export const testimonials: Testimonial[] = [
  {
    id: 1,
    author: "Carlos Eduardo Silva",
    city: "São Paulo, SP",
    avatar: "CE",
    rating: 5,
    body: "Comprei 4 camisas em uma semana. A qualidade é absurda, o atendimento impecável e a entrega super rápida. Já indiquei para todos os meus amigos torcedores. A Style Shooes é referência!",
    product: "Camisa Brasil Away 22/23 — Edição Copa",
    productId: 4,
  },
  {
    id: 2,
    author: "Priscila Rodrigues",
    city: "Rio de Janeiro, RJ",
    avatar: "PR",
    rating: 5,
    body: "Recebi meu pedido em apenas 2 dias! A camisa está perfeita, exatamente como nas fotos. Estou tão satisfeita que já fiz um segundo pedido. A embalagem é super cuidadosa, chegou sem nenhum amasso.",
    product: "Camisa Brasil Home 2024",
    productId: 1,
  },
  {
    id: 3,
    author: "Diego Martins",
    city: "Belo Horizonte, MG",
    avatar: "DM",
    rating: 5,
    body: "Tailandesa premium de altíssima qualidade. Já comprei em outros lugares e sentia diferença — aqui o acabamento é absurdamente superior. O escudo bordado, a costura, o tecido... tudo impecável.",
    product: "Retro Brasil 1998 Home — #9 Ronaldo",
    productId: 16,
  },
  {
    id: 4,
    author: "Fernanda Lima",
    city: "Curitiba, PR",
    avatar: "FL",
    rating: 5,
    body: "Presente para o meu namorado que amou! Ele disse que é a melhor camisa que já ganhou na vida. Chegou em uma embalagem linda, com direito a cartão personalizado. Com certeza vou comprar mais vezes!",
    product: "Camisa Brasil Edição Especial Preta Dourada",
    productId: 10,
  },
  {
    id: 5,
    author: "Rodrigo Pereira",
    city: "Fortaleza, CE",
    avatar: "RP",
    rating: 5,
    body: "Minha terceira compra na Style Shooes e continua perfeita. Variedade enorme, preço justo e qualidade garantida. O tecido das camisas é muito superior ao que encontro em outros sites. Já virei cliente fiel!",
    product: "Camisa Brasil Home Jordan",
    productId: 7,
  },
  {
    id: 6,
    author: "Ana Paula Costa",
    city: "Recife, PE",
    avatar: "AP",
    rating: 5,
    body: "Finalmente encontrei uma loja que entende de futebol! As descrições são honestas, as fotos condizem com o produto real e o suporte respondeu minha dúvida em menos de 1 hora. Nota 10 em tudo!",
    product: "Camisa Brasil Away 2024",
    productId: 2,
  },
];

export function getProductReviews(productId: number): Review[] {
  return reviews.filter((r) => r.productId === productId);
}

export function getRatingBreakdown(productId: number) {
  const productReviews = getProductReviews(productId);
  const total = productReviews.length;
  if (total === 0) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  return {
    5: Math.round((productReviews.filter((r) => r.rating === 5).length / total) * 100),
    4: Math.round((productReviews.filter((r) => r.rating === 4).length / total) * 100),
    3: Math.round((productReviews.filter((r) => r.rating === 3).length / total) * 100),
    2: Math.round((productReviews.filter((r) => r.rating === 2).length / total) * 100),
    1: Math.round((productReviews.filter((r) => r.rating === 1).length / total) * 100),
  };
}
