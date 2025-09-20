/**
 * Produtos do Cardápio - Costela do Titi
 * Estrutura de dados centralizada
 */

const PRODUCTS = {
    // Sanduíches principais
    sandwiches: {
        casa: {
            id: 'casa',
            name: "Pão da Casa",
            description: "Pão artesanal, costela desfiada 120g, queijo derretido, alface crocante e banana frita dourada.",
            price: 20.00,
            originalPrice: 25.00,
            category: "sandwiches",
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop&crop=center",
            badges: ["popular", "discount"],
            features: ["15 min", "Defumado", "120g"],
            rating: 4.8,
            reviews: 89,
            customizable: true
        },
        titi: {
            id: 'titi',
            name: "Pão do Titi",
            description: "Pão especial, costela premium 120g, queijo cheddar, bacon crocante, alface, cebola roxa e banana frita.",
            price: 25.00,
            category: "sandwiches",
            image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&h=300&fit=crop&crop=center",
            badges: ["bestseller", "recommended"],
            features: ["Premium", "Defumado 12h", "Premiado"],
            rating: 4.9,
            reviews: 156,
            customizable: true
        },
        premium: {
            id: 'premium',
            name: "Costela Premium",
            description: "Pão baguete artesanal, costela defumada premium 180g, queijo cheddar especial, cebola caramelizada e molho barbecue artesanal.",
            price: 29.90,
            category: "sandwiches",
            image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop&crop=center",
            badges: ["premium", "exclusive"],
            features: ["Gourmet", "180g", "Chef"],
            rating: 4.9,
            reviews: 67,
            customizable: true
        }
    },

    // Bebidas
    drinks: {
        agua_mineral: {
            id: 'agua_mineral',
            name: "Água Mineral",
            description: "Água mineral natural gelada",
            price: 3.00,
            category: "drinks",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop&crop=center",
            customizable: false
        },
        agua_gas: {
            id: 'agua_gas',
            name: "Água Mineral c/ Gás",
            description: "Água mineral com gás gelada",
            price: 4.00,
            category: "drinks",
            image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop&crop=center",
            customizable: false
        },
        refri_lata: {
            id: 'refri_lata',
            name: "Refrigerante Lata",
            description: "Coca-Cola, Guaraná, Sprite",
            price: 5.00,
            category: "drinks",
            image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop&crop=center",
            customizable: false
        },
        refri_1l: {
            id: 'refri_1l',
            name: "Refrigerante 1L",
            description: "Coca-Cola, Guaraná para compartilhar",
            price: 10.00,
            category: "drinks",
            image: "https://images.unsplash.com/photo-1581636625402-29d2c5305b85?w=400&h=300&fit=crop&crop=center",
            customizable: false
        }
    },

    // Acompanhamentos
    sides: {
        batata_150: {
            id: 'batata_150',
            name: "Batata Frita 150g",
            description: "Batata rústica crocante individual",
            price: 10.00,
            category: "sides",
            image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=300&fit=crop&crop=center",
            customizable: false
        },
        batata_300: {
            id: 'batata_300',
            name: "Batata Frita 300g",
            description: "Batata rústica crocante para compartilhar",
            price: 15.00,
            category: "sides",
            image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop&crop=center",
            customizable: false
        }
    }
};

// Adicionais disponíveis para personalização
const ADDITIONALS = {
    vinagrete: {
        id: 'vinagrete',
        name: "Vinagrete",
        description: "Molho especial da casa",
        price: 3.00
    },
    requeijao: {
        id: 'requeijao',
        name: "Requeijão",
        description: "Requeijão cremoso",
        price: 3.00
    },
    bacon: {
        id: 'bacon',
        name: "Bacon",
        description: "Bacon crocante defumado",
        price: 3.00
    },
    banana: {
        id: 'banana',
        name: "Banana Frita",
        description: "Banana doce dourada",
        price: 2.00
    },
    queijo_extra: {
        id: 'queijo_extra',
        name: "Queijo Extra",
        description: "Porção extra de queijo derretido",
        price: 4.00
    },
    cebola_caramelizada: {
        id: 'cebola_caramelizada',
        name: "Cebola Caramelizada",
        description: "Cebola doce caramelizada",
        price: 3.50
    },
    molho_barbecue: {
        id: 'molho_barbecue',
        name: "Molho Barbecue",
        description: "Molho barbecue artesanal",
        price: 2.50
    },
    molho_picante: {
        id: 'molho_picante',
        name: "Molho Picante",
        description: "Pimenta especial da casa",
        price: 2.00
    }
};

// Configurações de entrega
const DELIVERY_CONFIG = {
    baseRate: 7.00,
    maxDeliveryDistance: 10, // km
    ranges: [
        { maxDistance: 4, price: 8.00 },
        { maxDistance: 6, price: 10.00 },
        { maxDistance: 8, price: 12.00 },
        { maxDistance: 10, price: 15.00 }
    ]
};

// Coordenadas da loja (exemplo: São Paulo)
const STORE_COORDINATES = {
    lat: -23.5505,
    lng: -46.6333
};

// WhatsApp da loja
const WHATSAPP_NUMBER = '5511999999999';

// Função para obter produto por ID
function getProductById(productId) {
    const allProducts = {
        ...PRODUCTS.sandwiches,
        ...PRODUCTS.drinks,
        ...PRODUCTS.sides
    };
    return allProducts[productId] || null;
}

// Função para obter todos os produtos de uma categoria
function getProductsByCategory(category) {
    return PRODUCTS[category] || {};
}

// Função para calcular taxa de entrega baseada na distância
function calculateDeliveryFee(distance) {
    if (distance <= 0) return DELIVERY_CONFIG.baseRate;
    
    for (const range of DELIVERY_CONFIG.ranges) {
        if (distance <= range.maxDistance) {
            return range.price;
        }
    }
    
    return null; // Fora da área de entrega
}

// Função para verificar se a entrega é gratuita
function isFreeDelivery(subtotal, distance) {
    return false; // Frete grátis desabilitado
}

// Função para formatar preço
function formatPrice(price) {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

// Função para calcular distância entre dois pontos (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // Arredonda para 2 casas decimais
}

// Exportar para uso global (se necessário)
if (typeof window !== 'undefined') {
    window.PRODUCTS = PRODUCTS;
    window.ADDITIONALS = ADDITIONALS;
    window.DELIVERY_CONFIG = DELIVERY_CONFIG;
    window.STORE_COORDINATES = STORE_COORDINATES;
    window.WHATSAPP_NUMBER = WHATSAPP_NUMBER;
    window.getProductById = getProductById;
    window.getProductsByCategory = getProductsByCategory;
    window.calculateDeliveryFee = calculateDeliveryFee;
    window.isFreeDelivery = isFreeDelivery;
    window.formatPrice = formatPrice;
    window.calculateDistance = calculateDistance;
}