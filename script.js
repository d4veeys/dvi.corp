/**
 * Sistema de Cardápio Online - Costela do Titi
 * Versão: 2.0 - Sistema completo com cálculo automático de frete
 */

// ========== CONFIGURAÇÕES E CONSTANTES ==========
const CONFIG = {
    whatsappNumber: '5569992588282',
    prepareTime: '15-20',
    minOrderValue: 20,
    freeDeliveryThreshold: 50,
    restaurantAddress: 'Av. Tiradentes, 2958 - Embratel, Porto Velho - RO, 76820-882',
    restaurantCoords: { lat: -8.7612, lng: -63.9004 }, // Coordenadas de Porto Velho
    deliveryZones: {
        zone1: { maxDistance: 4, fee: 8.00, freeDelivery: true },
        zone2: { maxDistance: 6, fee: 10.00, freeDelivery: false },
        zone3: { maxDistance: 8, fee: 12.00, freeDelivery: false },
        zone4: { maxDistance: 10, fee: 15.00, freeDelivery: false }
    }
};

const PRODUCTS = {
    // Lanches
    'casa': { 
        name: 'Pão da Casa', 
        price: 20.00, 
        originalPrice: 25.00,
        category: 'lanche',
        description: 'Pão artesanal, costela desfiada 120g, queijo derretido, alface crocante e banana frita dourada.'
    },
    'titi': { 
        name: 'Pão do Titi', 
        price: 25.00,
        category: 'lanche',
        description: 'Pão especial, costela premium 120g, queijo cheddar, bacon crocante, alface, cebola roxa e banana frita.'
    },
    'premium': { 
        name: 'Costela Premium', 
        price: 29.90,
        category: 'lanche',
        description: 'Pão baguete artesanal, costela defumada premium 180g, queijo cheddar especial, cebola caramelizada e molho barbecue artesanal.'
    },
    // Bebidas
    'agua_mineral': { name: 'Água Mineral', price: 3.00, category: 'bebida' },
    'agua_gas': { name: 'Água Mineral c/ Gás', price: 4.00, category: 'bebida' },
    'refri_lata': { name: 'Refrigerante Lata', price: 5.00, category: 'bebida' },
    'refri_1l': { name: 'Refrigerante 1L', price: 10.00, category: 'bebida' },
    // Porções
    'batata_150': { name: 'Batata Frita 150g', price: 10.00, category: 'porcao' },
    'batata_300': { name: 'Batata Frita 300g', price: 15.00, category: 'porcao' }
};

const ADDITIONALS = {
    'vinagrete': { name: 'Vinagrete', price: 3.00 },
    'requeijao': { name: 'Requeijão', price: 3.00 },
    'bacon': { name: 'Bacon', price: 3.00 },
    'banana': { name: 'Banana Frita', price: 2.00 }
};

// ========== ESTADO DA APLICAÇÃO ==========
let cart = {};
let isDelivery = false;
let currentCustomizing = null;
let deliveryInfo = null;

// Elementos DOM
const elements = {
    cartItems: document.getElementById('cart-items'),
    cartTotal: document.getElementById('cart-total'),
    cartSubtotal: document.getElementById('cart-subtotal'),
    deliveryFeeContainer: document.getElementById('delivery-fee-container'),
    deliveryFeeValue: document.getElementById('delivery-fee-value'),
    customerModal: document.getElementById('customer-modal'),
    customizeModal: document.getElementById('customize-modal'),
    modalTitle: document.getElementById('modal-title'),
    deliveryFields: document.getElementById('delivery-fields'),
    localInstructions: document.getElementById('local-instructions'),
    addressFields: document.getElementById('address-fields'),
    floatingCart: document.getElementById('floating-cart'),
    floatingCartCount: document.getElementById('floating-cart-count'),
    floatingItemsText: document.getElementById('floating-items-text'),
    floatingTotal: document.getElementById('floating-total')
};

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Remover loading overlay
    setTimeout(() => {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
            setTimeout(() => loadingOverlay.remove(), 500);
        }
    }, 1000);

    initializeEventListeners();
    updateCartDisplay();
    updateFloatingCart();
    restoreCartFromBackup();
}

function initializeEventListeners() {
    // Botões delivery/local
    document.getElementById('local-btn')?.addEventListener('click', () => toggleDeliveryOption(false));
    document.getElementById('viagem-btn')?.addEventListener('click', () => toggleDeliveryOption(true));

    // Botões de quantidade
    document.querySelectorAll('.qty-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.product;
            const action = this.dataset.action;
            updateQuantity(productId, action === 'increase' ? 1 : -1);
        });
    });

    // Botões adicionar ao carrinho
    document.querySelectorAll('.add-to-cart, .add-to-cart-direct, .quick-add').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.product;
            addToCartDirect(productId);
        });
    });

    // Botões personalizar
    document.querySelectorAll('.customize-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.product;
            openCustomizeModal(productId);
        });
    });

    // Modal de personalização
    document.getElementById('add-customized')?.addEventListener('click', addCustomizedToCart);
    document.querySelectorAll('input[name="additional"]').forEach(input => {
        input.addEventListener('change', updateCustomizeTotal);
    });

    // Formulário do cliente
    document.getElementById('finalizar-pedido')?.addEventListener('click', finalizarPedido);
    document.getElementById('buscar-cep')?.addEventListener('click', buscarCep);
    document.getElementById('enviar-whatsapp')?.addEventListener('click', enviarPedidoWhatsApp);
    
    // Formatação de campos
    document.getElementById('customer-cep')?.addEventListener('input', function() {
        formatarCep(this);
    });
    document.getElementById('customer-phone')?.addEventListener('input', function() {
        formatarTelefone(this);
    });

    // Formulário submit
    document.getElementById('customer-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        enviarPedidoWhatsApp();
    });

    // Limpar carrinho
    document.getElementById('clear-cart')?.addEventListener('click', clearCart);

    // Scroll listener
    window.addEventListener('scroll', handleScroll);

    // ESC para fechar modais
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCustomizeModal();
            closeCustomerModal();
        }
    });

    // Backup automático do carrinho
    window.addEventListener('beforeunload', saveCartBackup);
}

// ========== FUNÇÕES DO CARRINHO ==========
function toggleDeliveryOption(delivery) {
    isDelivery = delivery;
    
    document.getElementById('local-btn')?.classList.toggle('active', !delivery);
    document.getElementById('viagem-btn')?.classList.toggle('active', delivery);
    
    updateCartDisplay();
    updateFloatingCart();
}

function updateQuantity(productId, change) {
    const qtyElement = document.getElementById(`qty-${productId}`);
    if (!qtyElement) return;
    
    let quantity = parseInt(qtyElement.textContent);
    quantity += change;
    
    if (quantity < 0) quantity = 0;
    
    qtyElement.textContent = quantity;
}

function addToCartDirect(productId) {
    const product = PRODUCTS[productId];
    if (!product) return;

    let quantity = 1;
    const qtyElement = document.getElementById(`qty-${productId}`);
    
    if (qtyElement) {
        quantity = parseInt(qtyElement.textContent);
        if (quantity <= 0) {
            showNotification('Selecione uma quantidade antes de adicionar.', 'warning');
            return;
        }
        qtyElement.textContent = '0';
    }

    addItemToCart(productId, quantity);
}

function addItemToCart(productId, quantity = 1, additionals = [], notes = '') {
    const product = PRODUCTS[productId];
    if (!product) return;

    const itemId = generateItemId(productId, additionals);
    
    if (cart[itemId]) {
        cart[itemId].quantity += quantity;
    } else {
        let totalPrice = product.price;
        let additionalsInfo = [];
        
        additionals.forEach(additionalId => {
            const additional = ADDITIONALS[additionalId];
            if (additional) {
                totalPrice += additional.price;
                additionalsInfo.push(additional.name);
            }
        });

        cart[itemId] = {
            productId: productId,
            name: product.name,
            basePrice: product.price,
            totalPrice: totalPrice,
            quantity: quantity,
            additionals: additionals,
            additionalsInfo: additionalsInfo,
            notes: notes,
            category: product.category
        };
    }
    
    updateCartDisplay();
    updateFloatingCart();
    saveCartBackup();
    showNotification(`${product.name} adicionado ao carrinho!`, 'success');
}

function generateItemId(productId, additionals = []) {
    const additionalsStr = additionals.sort().join(',');
    return `${productId}_${additionalsStr}`;
}

function changeCartItemQuantity(itemId, change) {
    if (cart[itemId]) {
        cart[itemId].quantity += change;
        
        if (cart[itemId].quantity <= 0) {
            delete cart[itemId];
        }
        
        updateCartDisplay();
        updateFloatingCart();
        saveCartBackup();
    }
}

function clearCart() {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
        cart = {};
        updateCartDisplay();
        updateFloatingCart();
        saveCartBackup();
        showNotification('Carrinho limpo!', 'info');
    }
}

// ========== CÁLCULO DE FRETE ==========
function calculateDeliveryFee(orderValue, distance) {
    if (!distance) {
        return { fee: 0, text: 'A calcular' };
    }
    
    for (const [zoneName, zone] of Object.entries(CONFIG.deliveryZones)) {
        if (distance <= zone.maxDistance) {
            if (zone.freeDelivery && orderValue >= CONFIG.freeDeliveryThreshold) {
                return { fee: 0, text: 'Grátis' };
            }
            return { fee: zone.fee, text: `R$ ${zone.fee.toFixed(2)}` };
        }
    }
    
    return { fee: 0, text: 'Fora da área de entrega' };
}

async function calculateDistanceFromCEP(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (data.erro) return null;
        
        const address = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`;
        const coords = await getCoordinatesFromAddress(address);
        
        if (!coords) return null;
        
        const distance = calculateDistance(
            CONFIG.restaurantCoords.lat,
            CONFIG.restaurantCoords.lng,
            coords.lat,
            coords.lng
        );
        
        return {
            distance: Math.round(distance * 100) / 100,
            address: address,
            coords: coords
        };
    } catch (error) {
        console.error('Erro ao calcular distância:', error);
        return null;
    }
}

async function getCoordinatesFromAddress(address) {
    try {
        const encodedAddress = encodeURIComponent(address);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`);
        const data = await response.json();
        
        if (data.length === 0) return null;
        
        return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
        };
    } catch (error) {
        console.error('Erro ao buscar coordenadas:', error);
        return null;
    }
}

function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Raio da Terra em km
    const dLat = deg2rad(lat2 - lat1);
    const dLng = deg2rad(lng2 - lng1);
    
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

// ========== ATUALIZAÇÃO DE DISPLAYS ==========
function updateCartDisplay() {
    const summary = getCartSummary();
    const cartItems = elements.cartItems;
    const cartSummary = document.getElementById('cart-summary');
    
    if (!cartItems) return;
    
    if (summary.isEmpty) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Seu carrinho está vazio</h3>
                <p>Adicione alguns de nossos deliciosos sanduíches!</p>
            </div>
        `;
        if (cartSummary) cartSummary.style.display = 'none';
    } else {
        renderCartItems();
        renderCartSummary(summary);
        if (cartSummary) cartSummary.style.display = 'block';
    }
    
    updateCartCount(summary);
}

function renderCartItems() {
    const cartItems = elements.cartItems;
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    
    for (const [itemId, item] of Object.entries(cart)) {
        const itemTotal = item.totalPrice * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        let additionalsHtml = '';
        if (item.additionalsInfo && item.additionalsInfo.length > 0) {
            additionalsHtml = `<div class="cart-item-details">+ ${item.additionalsInfo.join(', ')}</div>`;
        }
        
        let notesHtml = '';
        if (item.notes) {
            notesHtml = `<div class="cart-item-details">Obs: ${item.notes}</div>`;
        }
        
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                ${additionalsHtml}
                ${notesHtml}
                <div class="cart-item-price">R$ ${item.totalPrice.toFixed(2)} cada</div>
            </div>
            <div class="cart-item-quantity">
                <button class="qty-btn cart-qty-btn" data-item="${itemId}" data-action="decrease">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn cart-qty-btn" data-item="${itemId}" data-action="increase">+</button>
            </div>
            <div class="cart-item-total">R$ ${itemTotal.toFixed(2)}</div>
        `;
        
        cartItem.querySelectorAll('.cart-qty-btn').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.dataset.item;
                const action = this.dataset.action;
                changeCartItemQuantity(itemId, action === 'increase' ? 1 : -1);
            });
        });
        
        cartItems.appendChild(cartItem);
    }
}

function renderCartSummary(summary) {
    if (elements.cartSubtotal) {
        elements.cartSubtotal.textContent = `R$ ${summary.subtotal.toFixed(2)}`;
    }
    
    if (elements.cartTotal) {
        elements.cartTotal.textContent = `R$ ${summary.total.toFixed(2)}`;
    }
    
    if (isDelivery && summary.subtotal > 0) {
        if (elements.deliveryFeeContainer) {
            elements.deliveryFeeContainer.style.display = 'block';
        }
        if (elements.deliveryFeeValue) {
            elements.deliveryFeeValue.textContent = summary.deliveryText;
        }
        
        const deliveryInfoElement = document.getElementById('delivery-info');
        if (deliveryInfoElement && deliveryInfo) {
            let infoText = `Distância: ${deliveryInfo.distance}km`;
            if (summary.deliveryFee === 0 && summary.deliveryText === 'Grátis') {
                infoText += ' • Frete grátis!';
            }
            deliveryInfoElement.textContent = infoText;
            deliveryInfoElement.style.display = 'block';
        }
    } else {
        if (elements.deliveryFeeContainer) {
            elements.deliveryFeeContainer.style.display = 'none';
        }
    }
}

function updateCartCount(summary) {
    const headerCount = document.getElementById('cart-count-header');
    const clearBtn = document.getElementById('clear-cart');
    
    if (headerCount) {
        headerCount.textContent = summary.totalItems === 1 ? '1 item' : `${summary.totalItems} itens`;
    }
    
    if (clearBtn) {
        clearBtn.style.display = summary.isEmpty ? 'none' : 'block';
    }
}

function updateFloatingCart() {
    const summary = getCartSummary();
    
    if (summary.isEmpty) {
        elements.floatingCart?.classList.remove('show');
        return;
    }
    
    elements.floatingCart?.classList.add('show');
    
    if (elements.floatingCartCount) {
        elements.floatingCartCount.textContent = summary.totalItems;
    }
    
    if (elements.floatingItemsText) {
        elements.floatingItemsText.textContent = summary.totalItems === 1 ? 
            '1 item no carrinho' : `${summary.totalItems} itens no carrinho`;
    }
    
    if (elements.floatingTotal) {
        elements.floatingTotal.textContent = `R$ ${summary.total.toFixed(2)}`;
    }
    
    // Animação do contador
    if (elements.floatingCartCount) {
        elements.floatingCartCount.style.animation = 'none';
        setTimeout(() => {
            elements.floatingCartCount.style.animation = 'cartPulse 0.6s ease-in-out';
        }, 10);
    }
}

function getCartSummary() {
    const summary = {
        itemCount: Object.keys(cart).length,
        totalItems: 0,
        subtotal: 0,
        deliveryFee: 0,
        deliveryText: '',
        total: 0,
        isEmpty: Object.keys(cart).length === 0
    };
    
    for (const itemId in cart) {
        const item = cart[itemId];
        summary.totalItems += item.quantity;
        summary.subtotal += item.totalPrice * item.quantity;
    }

    if (isDelivery && !summary.isEmpty && deliveryInfo) {
        const deliveryResult = calculateDeliveryFee(summary.subtotal, deliveryInfo.distance);
        summary.deliveryFee = deliveryResult.fee;
        summary.deliveryText = deliveryResult.text;
    } else if (isDelivery && !summary.isEmpty) {
        summary.deliveryText = 'A calcular';
    }

    summary.total = summary.subtotal + summary.deliveryFee;
    return summary;
}

// ========== MODAIS ==========
function openCustomizeModal(productId) {
    const product = PRODUCTS[productId];
    if (!product) return;

    currentCustomizing = productId;
    
    const modal = elements.customizeModal;
    const title = document.getElementById('customize-title');
    const productInfo = document.getElementById('base-product-info');
    
    if (title) title.textContent = `Personalizar ${product.name}`;
    
    if (productInfo) {
        productInfo.innerHTML = `
            <div class="base-product-name">${product.name}</div>
            <div class="base-product-price">R$ ${product.price.toFixed(2)}</div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">${product.description}</div>
        `;
    }
    
    // Limpar seleções anteriores
    document.querySelectorAll('input[name="additional"]').forEach(input => {
        input.checked = false;
    });
    
    const itemNotes = document.getElementById('item-notes');
    if (itemNotes) itemNotes.value = '';
    
    updateCustomizeTotal();
    showModal(modal);
}

function closeCustomizeModal() {
    const modal = elements.customizeModal;
    hideModal(modal);
    currentCustomizing = null;
}

function updateCustomizeTotal() {
    if (!currentCustomizing) return;
    
    const product = PRODUCTS[currentCustomizing];
    let total = product.price;
    
    document.querySelectorAll('input[name="additional"]:checked').forEach(input => {
        total += parseFloat(input.dataset.price);
    });
    
    const totalElement = document.getElementById('customize-total-value');
    if (totalElement) totalElement.textContent = `R$ ${total.toFixed(2)}`;
}

function addCustomizedToCart() {
    if (!currentCustomizing) return;
    
    const additionals = [];
    document.querySelectorAll('input[name="additional"]:checked').forEach(input => {
        additionals.push(input.value);
    });
    
    const itemNotes = document.getElementById('item-notes');
    const notes = itemNotes ? itemNotes.value.trim() : '';
    
    addItemToCart(currentCustomizing, 1, additionals, notes);
    closeCustomizeModal();
}

function openCustomerModal() {
    const modal = elements.customerModal;
    const title = elements.modalTitle;
    const deliveryFields = elements.deliveryFields;
    const localInstructions = elements.localInstructions;
    
    if (isDelivery) {
        if (title) title.textContent = 'Informações para Entrega';
        if (deliveryFields) deliveryFields.style.display = 'block';
        if (localInstructions) localInstructions.style.display = 'none';
    } else {
        if (title) title.textContent = 'Informações para Consumo no Local';
        if (deliveryFields) deliveryFields.style.display = 'none';
        if (localInstructions) localInstructions.style.display = 'block';
    }
    
    showModal(modal);
}

function closeCustomerModal() {
    const modal = elements.customerModal;
    hideModal(modal);
}

function showModal(modal) {
    if (!modal) return;
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    if (!modal) return;
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

// ========== FORMULÁRIOS ==========
async function buscarCep() {
    const cepInput = document.getElementById('customer-cep');
    const searchBtn = document.getElementById('buscar-cep');
    const addressFields = elements.addressFields;
    const deliveryDistance = document.getElementById('delivery-distance');
    
    if (!cepInput || !searchBtn) return;
    
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        showNotification('CEP inválido. Digite um CEP com 8 dígitos.', 'error');
        return;
    }
    
    // Loading state
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
    searchBtn.disabled = true;
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (data.erro) {
            showNotification('CEP não encontrado. Preencha o endereço manualmente.', 'warning');
            if (addressFields) {
                addressFields.style.display = 'block';
                addressFields.classList.add('show');
            }
            return;
        }
        
        // Preencher campos
        const addressInput = document.getElementById('customer-address');
        const neighborhoodInput = document.getElementById('customer-neighborhood');
        const cityInput = document.getElementById('customer-city');
        const stateInput = document.getElementById('customer-state');
        
        if (addressInput) addressInput.value = data.logradouro || '';
        if (neighborhoodInput) neighborhoodInput.value = data.bairro || '';
        if (cityInput) cityInput.value = data.localidade || '';
        if (stateInput) stateInput.value = data.uf || '';
        
        if (addressFields) {
            addressFields.style.display = 'block';
            addressFields.classList.add('show');
        }
        
        // Calcular distância
        const distanceInfo = await calculateDistanceFromCEP(cep);
        
        if (distanceInfo) {
            deliveryInfo = distanceInfo;
            
            const maxDistance = Math.max(...Object.values(CONFIG.deliveryZones).map(z => z.maxDistance));
            
            if (deliveryDistance) {
                if (distanceInfo.distance <= maxDistance) {
                    deliveryDistance.innerHTML = `
                        <i class="fas fa-check-circle"></i>
                        Distância: ${distanceInfo.distance}km - Entregamos nesta região!
                    `;
                    deliveryDistance.style.background = 'var(--success)';
                } else {
                    deliveryDistance.innerHTML = `
                        <i class="fas fa-exclamation-triangle"></i>
                        Distância: ${distanceInfo.distance}km - Fora da área de entrega
                    `;
                    deliveryDistance.style.background = 'var(--danger)';
                }
                deliveryDistance.style.display = 'block';
            }
            
            updateCartDisplay();
            updateFloatingCart();
        }
        
        const numberInput = document.getElementById('customer-number');
        if (numberInput) numberInput.focus();
        
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        showNotification('Erro ao buscar CEP. Preencha o endereço manualmente.', 'error');
        if (addressFields) {
            addressFields.style.display = 'block';
            addressFields.classList.add('show');
        }
    } finally {
        searchBtn.innerHTML = '<i class="fas fa-search"></i> Buscar';
        searchBtn.disabled = false;
    }
}

function formatarCep(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    input.value = value;
}

function formatarTelefone(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 0) {
        value = '(' + value;
        if (value.length > 3) {
            value = value.substring(0, 3) + ') ' + value.substring(3);
        }
        if (value.length > 10) {
            value = value.substring(0, 10) + '-' + value.substring(10, 14);
        }
    }
    input.value = value;
}

function validateForm() {
    const name = document.getElementById('customer-name')?.value.trim() || '';
    const phone = document.getElementById('customer-phone')?.value.trim() || '';
    
    if (!name || name.length < 2) {
        showNotification('Nome deve ter pelo menos 2 caracteres', 'error');
        return false;
    }
    
    if (!phone || phone.replace(/\D/g, '').length < 10) {
        showNotification('Digite um telefone válido', 'error');
        return false;
    }
    
    if (isDelivery) {
        const address = document.getElementById('customer-address')?.value.trim() || '';
        const number = document.getElementById('customer-number')?.value.trim() || '';
        const neighborhood = document.getElementById('customer-neighborhood')?.value.trim() || '';
        const city = document.getElementById('customer-city')?.value.trim() || '';
        const state = document.getElementById('customer-state')?.value.trim() || '';
        
        if (!address || !number || !neighborhood || !city || !state) {
            showNotification('Para delivery, é necessário informar o endereço completo.', 'error');
            return false;
        }
        
        if (deliveryInfo) {
            const maxDistance = Math.max(...Object.values(CONFIG.deliveryZones).map(z => z.maxDistance));
            if (deliveryInfo.distance > maxDistance) {
                showNotification('Endereço fora da área de entrega.', 'error');
                return false;
            }
        }
    }
    
    return true;
}

// ========== WHATSAPP ==========
function enviarPedidoWhatsApp() {
    if (!validateForm()) return;
    
    const summary = getCartSummary();
    if (isDelivery && summary.subtotal < CONFIG.minOrderValue) {
        showNotification(`Pedido mínimo para delivery: R$ ${CONFIG.minOrderValue.toFixed(2)}`, 'warning');
        return;
    }
    
    const message = buildWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Limpar e fechar
    clearFormAndCart();
    closeCustomerModal();
    showNotification('Pedido enviado com sucesso! Aguarde nosso contato.', 'success', 5000);
}

function buildWhatsAppMessage() {
    const name = document.getElementById('customer-name')?.value.trim() || '';
    const phone = document.getElementById('customer-phone')?.value.trim() || '';
    const notes = document.getElementById('customer-notes')?.value.trim() || '';
    const orderType = isDelivery ? 'Delivery' : 'Retirada';
    const summary = getCartSummary();
    
    let message = `*NOVO PEDIDO - Costela do Titi*%0A%0A`;
    message += `*Cliente:* ${name}%0A`;
    message += `*Telefone:* ${phone}%0A`;
    message += `*Tipo:* ${orderType}%0A%0A`;
    
    // Endereço para delivery
    if (isDelivery) {
        const address = document.getElementById('customer-address')?.value.trim() || '';
        const number = document.getElementById('customer-number')?.value.trim() || '';
        const complement = document.getElementById('customer-complement')?.value.trim() || '';
        const neighborhood = document.getElementById('customer-neighborhood')?.value.trim() || '';
        const city = document.getElementById('customer-city')?.value.trim() || '';
        const state = document.getElementById('customer-state')?.value.trim() || '';
        
        message += `*Endereco:* ${address}, ${number}`;
        if (complement) message += `, ${complement}`;
        message += ` - ${neighborhood}, ${city}-${state}%0A`;
        
        if (deliveryInfo) {
            message += `*Distancia:* ${deliveryInfo.distance}km%0A`;
        }
        message += `%0A`;
    }
    
    // Itens do pedido por categoria
    message += `*ITENS DO PEDIDO:*%0A%0A`;
    
    const categories = {
        'lanche': 'SANDUICHES',
        'bebida': 'BEBIDAS',
        'porcao': 'ACOMPANHAMENTOS'
    };
    
    const itemsByCategory = {};
    for (const [itemId, item] of Object.entries(cart)) {
        const category = item.category || 'outros';
        if (!itemsByCategory[category]) {
            itemsByCategory[category] = [];
        }
        itemsByCategory[category].push({ itemId, ...item });
    }
    
    Object.keys(itemsByCategory).forEach(category => {
        if (categories[category]) {
            message += `*${categories[category]}*%0A`;
        }
        
        itemsByCategory[category].forEach(item => {
            const itemTotal = item.totalPrice * item.quantity;
            message += `• ${item.quantity}x ${item.name}`;
            
            if (item.additionalsInfo && item.additionalsInfo.length > 0) {
                message += ` (+ ${item.additionalsInfo.join(', ')})`;
            }
            
            message += ` - R$ ${itemTotal.toFixed(2)}`;
            
            if (item.notes) {
                message += `%0A  Obs: ${item.notes}`;
            }
            
            message += `%0A`;
        });
        
        message += `%0A`;
    });
    
    // Resumo financeiro
    message += `*RESUMO FINANCEIRO*%0A`;
    message += `Subtotal: R$ ${summary.subtotal.toFixed(2)}%0A`;
    
    if (isDelivery) {
        if (summary.deliveryFee === 0 && summary.deliveryText === 'Grátis') {
            message += `Entrega: Gratis%0A`;
        } else if (summary.deliveryFee > 0) {
            message += `Entrega: R$ ${summary.deliveryFee.toFixed(2)}%0A`;
        } else {
            message += `Entrega: ${summary.deliveryText}%0A`;
        }
    }
    
    message += `*TOTAL: R$ ${summary.total.toFixed(2)}*%0A%0A`;
    
    if (notes) {
        message += `*Observacoes:* ${notes}%0A%0A`;
    }
    
    if (isDelivery) {
        message += `*Delivery* - Tempo estimado: 30-45 minutos%0A`;
        message += `Entraremos em contato para confirmar o pedido!%0A%0A`;
    } else {
        message += `*Retirada no Local* - Tempo estimado: ${CONFIG.prepareTime} minutos%0A`;
        message += `Avisaremos quando estiver pronto para retirada!%0A%0A`;
    }
    
    message += `_Pedido realizado via site_`;
    
    return message;
}

// ========== FUNÇÕES AUXILIARES ==========
function finalizarPedido() {
    const summary = getCartSummary();
    
    if (summary.isEmpty) {
        showNotification('Adicione itens ao carrinho antes de finalizar o pedido.', 'warning');
        return;
    }
    
    if (isDelivery && summary.subtotal < CONFIG.minOrderValue) {
        showNotification(`Pedido mínimo para delivery: R$ ${CONFIG.minOrderValue.toFixed(2)}`, 'warning');
        return;
    }
    
    openCustomerModal();
}

function scrollToCart() {
    const cartSection = document.querySelector('.cart-section');
    if (cartSection) {
        cartSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }
}

function scrollToMenu() {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
        menuSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    if (scrollTopBtn) {
        if (scrollTop > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    }
}

function clearFormAndCart() {
    // Limpar carrinho
    cart = {};
    deliveryInfo = null;
    
    // Limpar formulário
    const form = document.getElementById('customer-form');
    if (form) form.reset();
    
    // Resetar quantidades dos produtos
    document.querySelectorAll('.qty-value').forEach(element => {
        element.textContent = '0';
    });
    
    // Esconder campos de endereço
    const addressFields = elements.addressFields;
    if (addressFields) {
        addressFields.style.display = 'none';
        addressFields.classList.remove('show');
    }
    
    const deliveryDistance = document.getElementById('delivery-distance');
    if (deliveryDistance) deliveryDistance.style.display = 'none';
    
    // Atualizar displays
    updateCartDisplay();
    updateFloatingCart();
    clearCartBackup();
}

// ========== NOTIFICAÇÕES ==========
function showNotification(message, type = 'info', duration = 3000) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: getNotificationColor(type),
        color: 'white',
        padding: '16px 20px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '400px',
        fontSize: '14px',
        fontWeight: '500',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    });
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    return colors[type] || colors.info;
}

// ========== SISTEMA DE BACKUP ==========
function saveCartBackup() {
    try {
        const cartData = {
            cart: cart,
            isDelivery: isDelivery,
            deliveryInfo: deliveryInfo,
            timestamp: Date.now()
        };
        localStorage.setItem('titi_cart_backup', JSON.stringify(cartData));
    } catch (e) {
        console.warn('Não foi possível salvar backup do carrinho:', e);
    }
}

function restoreCartFromBackup() {
    try {
        const backupData = localStorage.getItem('titi_cart_backup');
        if (!backupData) return;
        
        const cartData = JSON.parse(backupData);
        const maxAge = 86400000; // 24 horas
        
        if (Date.now() - cartData.timestamp > maxAge) {
            clearCartBackup();
            return;
        }
        
        if (cartData.cart && Object.keys(cartData.cart).length > 0) {
            cart = cartData.cart;
            isDelivery = cartData.isDelivery || false;
            deliveryInfo = cartData.deliveryInfo || null;
            
            toggleDeliveryOption(isDelivery);
            updateCartDisplay();
            updateFloatingCart();
            
            showNotification('Carrinho restaurado da sessão anterior!', 'info');
        }
    } catch (e) {
        console.warn('Erro ao restaurar backup do carrinho:', e);
        clearCartBackup();
    }
}

function clearCartBackup() {
    try {
        localStorage.removeItem('titi_cart_backup');
    } catch (e) {
        console.warn('Erro ao limpar backup:', e);
    }
}

// ========== LOG DE DESENVOLVIMENTO ==========
console.log(`
🍔 Sistema Costela do Titi v2.0
================================
✅ Produtos disponíveis: ${Object.keys(PRODUCTS).length}
✅ Adicionais disponíveis: ${Object.keys(ADDITIONALS).length}  
✅ Zonas de delivery: ${Object.keys(CONFIG.deliveryZones).length}
✅ Cálculo automático de frete: Ativo
✅ Sistema de backup: Ativo
✅ Notificações: Ativo

Sistema carregado com sucesso! 🚀
`);