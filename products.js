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
            description: "Pão artesanal, costela desfiada 100g, queijo derretido, alface e banana frita.",
            price: 20.00,
            originalPrice: 25.00,
            category: "sandwiches",
            image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNGNUY1RjUiLz48cGF0aCBkPSJNMjAwIDEwMEM4OS41NDMgMTAwIDAgMTI2LjI4MSAwIDE2MEMwIDE5My43MTkgODkuNTQzIDIyMCAyMDAgMjIwQzMxMC40NTcgMjIwIDQwMCAxOTMuNzE5IDQwMCAxNjBDNDAwIDEyNi4yODEgMzEwLjQ1NyAxMDAgMjAwIDEwMFoiIGZpbGw9IiNEQUE1MjAiLz48dGV4dCB4PSIyMDAiIHk9IjE2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI0ZGRkZGRiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9IkFyaWFsIj5QQU8gREEgQ0FTQTwvdGV4dD48L3N2Zz4=",
            badges: ["popular", "discount"],
            features: ["25 min", "Defumado", "100g"],
            rating: 4.8,
            reviews: 89,
            customizable: true
        },
        titi: {
            id: 'titi',
            name: "Pão do Titi",
            description: "Pão especial, costela premium 150g, queijo, bacon crocante, alface, cebola roxa e banana frita.",
            price: 27.00,
            category: "sandwiches",
            image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNGNUY1RjUiLz48cGF0aCBkPSJNMjAwIDEwMEM4OS41NDMgMTAwIDAgMTI2LjI4MSAwIDE2MEMwIDE5My43MTkgODkuNTQzIDIyMCAyMDAgMjIwQzMxMC40NTcgMjIwIDQwMCAxOTMuNzE5IDQwMCAxNjBDNDAwIDEyNi4yODEgMzEwLjQ1NyAxMDAgMjAwIDEwMFoiIGZpbGw9IiM4QjQ1MTMiLz48dGV4dCB4PSIyMDAiIHk9IjE2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI0ZGRkZGRiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9IkFyaWFsIj5QQU8gRE8gVElUSTwvdGV4dD48L3N2Zz4=",
            badges: ["bestseller", "recommended"],
            features: ["Premium", "Defumado 12h", "Premiado"],
            rating: 4.9,
            reviews: 156,
            customizable: true
        },
        premium: {
            id: 'premium',
            name: "Cupim Premium",
            description: "Pão baguete artesanal, Cupim premium 150g, queijo, bacon crocante, alface, cebola roxa e banana frita.",
            price: 29.90,
            category: "sandwiches",
            image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNGNUY1RjUiLz48cGF0aCBkPSJNMjAwIDEwMEM4OS41NDMgMTAwIDAgMTI2LjI4MSAwIDE2MEMwIDE5My43MTkgODkuNTQzIDIyMCAyMDAgMjIwQzMxMC40NTcgMjIwIDQwMCAxOTMuNzE5IDQwMCAxNjBDNDAwIDEyNi4yODEgMzEwLjQ1NyAxMDAgMjAwIDEwMFoiIGZpbGw9IiM5QjU5QjYiLz48dGV4dCB4PSIyMDAiIHk9IjE2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI0ZGRkZGRiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9IkFyaWFsIj5DVVBJTSBQUkVNSVVNPC90ZXh0Pjwvc3ZnPg==",
            badges: ["premium", "exclusive"],
            features: ["Gourmet", "150g", "Chef"],
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
            description: "Água mineral natural gelada 500ml",
            price: 3.00,
            category: "drinks",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop&crop=center",
            customizable: false
        },
        agua_gas: {
            id: 'agua_gas',
            name: "Água com Gás",
            description: "Água mineral com gás gelada 500ml",
            price: 4.00,
            category: "drinks",
            image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop&crop=center",
            customizable: false
        },
        refri_lata: {
            id: 'refri_lata',
            name: "Refrigerante Lata",
            description: "Refrigerante gelado 350ml - Escolha o sabor",
            price: 5.00,
            category: "drinks",
            image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop&crop=center",
            customizable: false,
            flavors: ["Lata Coca", "Lata Coca Zero", "Lata Guaraná", "Lata Guaraná Zero", "Lata Fanta"]
        },
        refri_1l: {
            id: 'refri_1l',
            name: "Refrigerante 1L",
            description: "Refrigerante 1L para compartilhar - Escolha o sabor",
            price: 10.00,
            category: "drinks",
            image: "https://images.unsplash.com/photo-1581636625402-29d2c5305b85?w=400&h=300&fit=crop&crop=center",
            customizable: false,
            flavors: ["Coca Litro", "Guaraná Litro", "Fanta Litro"]
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
            image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNGNUY1RjUiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNTAiIHI9IjgwIiBmaWxsPSIjRkY2QjM1Ii8+PHRleHQgeD0iMjAwIiB5PSIxNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNGRkZGRkYiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCI+QkFUQVRBIDE1MEc8L3RleHQ+PC9zdmc+",
            customizable: false
        },
        batata_300: {
            id: 'batata_300',
            name: "Batata Frita 300g",
            description: "Batata rústica crocante para compartilhar",
            price: 15.00,
            category: "sides",
            image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNGNUY1RjUiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNTAiIHI9IjkwIiBmaWxsPSIjRkY2QjM1Ii8+PHRleHQgeD0iMjAwIiB5PSIxNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNGRkZGRkYiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCI+QkFUQVRBIDMwMEc8L3RleHQ+PC9zdmc+",
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
    maxDeliveryDistance: 15, // km
    ranges: [
        { maxDistance: 3, price: 5.00 },
        { maxDistance: 6, price: 8.00 },
        { maxDistance: 10, price: 12.00 },
        { maxDistance: 15, price: 18.00 }
    ]
};

// Coordenadas da loja - Porto Velho, RO (Av. Tiradentes, 2958 - Embratel)
const STORE_COORDINATES = {
    lat: -8.7619,
    lng: -63.9039,
    address: "Av. Tiradentes, 2958 - Embratel, Porto Velho - RO, 76820-882"
};

// WhatsApp da loja
const WHATSAPP_NUMBER = '5569992588282';

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