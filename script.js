// Configurações e constantes
const PRODUCTS = {
    // Lanches
    'casa': { 
        name: 'Pão da Casa', 
        price: 20.00, 
        category: 'lanche',
        description: 'Pão artesanal, costela defumada 120g, queijo coalho derretido, alface crocante e banana frita caramelizada'
    },
    'titi': { 
        name: 'Pão do Titi', 
        price: 25.00, 
        category: 'lanche',
        description: 'Pão artesanal, costela defumada 120g, queijo, bacon crocante, alface, cebola roxa e banana frita'
    },
    'premium': { 
        name: 'Costela Premium', 
        price: 29.90, 
        category: 'lanche',
        description: 'Pão baguete francês, costela defumada premium 140g, queijo cheddar importado, cebola caramelizada no vinho tinto e molho barbecue artesanal'
    },
    // Bebidas
    'agua_mineral': { name: 'Água Mineral', price: 3.00, category: 'bebida' },
    'agua_gas': { name: 'Água Mineral c/ Gás', price: 4.00, category: 'bebida' },
    'refri_lata': { name: 'Refrigerante Lata', price: 5.00, category: 'bebida' },
    'refri_1l': { name: 'Refrigerante 1L', price: 10.00, category: 'bebida' },
    // Porções
    'batata_150': { name: 'Batata Frita Pequena', price: 10.00, category: 'porcao' },
    'batata_300': { name: 'Batata Frita Grande', price: 15.00, category: 'porcao' }
};

const ADDITIONALS = {
    'vinagrete': { name: 'Vinagrete', price: 3.00 },
    'requeijao': { name: 'Requeijão', price: 3.00 },
    'bacon': { name: 'Bacon', price: 3.00 },
    'banana': { name: 'Banana', price: 2.00 }
};

const CONFIG = {
    deliveryFee: 0,
    whatsappNumber: '5569992588282', // Número do WhatsApp
    prepareTime: '35-40',
    minDeliveryValue: 0,
    deliveryText: 'A combinar'
};

// Estado da aplicação
let cart = {};
let isDelivery = false;
let currentCustomizing = null;
let cartCount = 0;

// Elementos DOM
const elements = {
    cartItems: document.getElementById('cart-items'),
    cartTotal: document.getElementById('cart-total'),
    deliveryFeeContainer: document.getElementById('delivery-fee-container'),
    deliveryFeeValue: document.getElementById('delivery-fee-value'),
    customerModal: document.getElementById('customer-modal'),
    customizeModal: document.getElementById('customize-modal'),
    modalTitle: document.getElementById('modal-title'),
    deliveryFields: document.getElementById('delivery-fields'),
    localInstructions: document.getElementById('local-instructions'),
    addressFields: document.getElementById('address-fields'),
    floatingCart: document.getElementById('floating-cart'),
    cartCountBadge: document.getElementById('cart-count')
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateCartDisplay();
    updateFloatingCartCount();
    
    // Animação suave ao carregar
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Event Listeners
function initializeEventListeners() {
    // Botões de delivery/local
    document.getElementById('local-btn').addEventListener('click', () => toggleDeliveryOption(false));
    document.getElementById('viagem-btn').addEventListener('click', () => toggleDeliveryOption(true));

    // Botões de quantidade (bebidas e porções)
    document.querySelectorAll('.qty-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.dataset.product;
            const action = this.dataset.action;
            updateQuantity(productId, action === 'increase' ? 1 : -1);
        });
    });

    // Botões adicionar direto (bebidas e porções)
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.dataset.product;
            addToCartDirect(productId);
        });
    });

    // Botões adicionar direto (lanches sem personalização)
    document.querySelectorAll('.add-to-cart-direct').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.dataset.product;
            addToCartDirect(productId);
        });
    });

    // Botões personalizar (lanches)
    document.querySelectorAll('.customize-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.dataset.product;
            openCustomizeModal(productId);
        });
    });

    // Modal de personalização
    const cancelCustomizeButtons = document.querySelectorAll('#cancel-customize, #cancel-customize-2');
    cancelCustomizeButtons.forEach(button => {
        button.addEventListener('click', closeCustomizeModal);
    });
    
    document.getElementById('add-customized').addEventListener('click', addCustomizedToCart);
    
    // Adicionar listeners para adicionais
    document.querySelectorAll('input[name="additional"]').forEach(input => {
        input.addEventListener('change', updateCustomizeTotal);
    });

    // Modal do cliente
    document.getElementById('finalizar-pedido').addEventListener('click', finalizarPedido);
    document.getElementById('buscar-cep').addEventListener('click', buscarCep);
    
    const cancelOrderButtons = document.querySelectorAll('#cancelar-pedido, #cancelar-pedido-2');
    cancelOrderButtons.forEach(button => {
        button.addEventListener('click', closeCustomerModal);
    });
    
    document.getElementById('enviar-whatsapp').addEventListener('click', enviarPedidoWhatsApp);

    // Formatação de campos
    document.getElementById('customer-cep').addEventListener('input', formatarCep);
    document.getElementById('customer-phone').addEventListener('input', formatarTelefone);

    // Fechar modais clicando fora
    elements.customizeModal.addEventListener('click', function(e) {
        if (e.target === this) closeCustomizeModal();
    });

    elements.customerModal.addEventListener('click', function(e) {
        if (e.target === this) closeCustomerModal();
    });

    // Scroll suave para o carrinho
    elements.floatingCart.addEventListener('click', scrollToCart);
}

// Scroll para o carrinho
function scrollToCart() {
    document.getElementById('cart-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Alternar opção de delivery
function toggleDeliveryOption(delivery) {
    isDelivery = delivery;
    
    document.getElementById('local-btn').classList.toggle('active', !delivery);
    document.getElementById('viagem-btn').classList.toggle('active', delivery);
    
    updateCartDisplay();
    
    // Feedback visual
    showFeedback(delivery ? 'Mudou para entrega' : 'Mudou para consumo no local', 'info');
}

// Atualizar quantidade
function updateQuantity(productId, change) {
    const qtyElement = document.getElementById(`qty-${productId}`);
    let quantity = parseInt(qtyElement.textContent);
    quantity += change;
    
    if (quantity < 0) quantity = 0;
    if (quantity > 99) quantity = 99; // Limite máximo
    
    qtyElement.textContent = quantity;
    
    // Animação de mudança
    qtyElement.style.transform = 'scale(1.2)';
    setTimeout(() => {
        qtyElement.style.transform = 'scale(1)';
    }, 150);
}

// Adicionar ao carrinho direto (sem personalização)
function addToCartDirect(productId) {
    const product = PRODUCTS[productId];
    if (!product) return;

    // Para bebidas e porções, usar a quantidade selecionada
    let quantity = 1;
    const qtyElement = document.getElementById(`qty-${productId}`);
    if (qtyElement) {
        quantity = parseInt(qtyElement.textContent);
        if (quantity <= 0) {
            showFeedback('Selecione uma quantidade antes de adicionar.', 'warning');
            // Highlight do campo quantidade
            const quantityDiv = qtyElement.closest('.quantity');
            quantityDiv.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                quantityDiv.style.animation = '';
            }, 500);
            return;
        }
        qtyElement.textContent = '0'; // Resetar
    }

    addItemToCart(productId, quantity);
}

// Adicionar item ao carrinho (função genérica)
function addItemToCart(productId, quantity = 1, additionals = [], notes = '') {
    const product = PRODUCTS[productId];
    if (!product) return;

    const itemId = generateItemId(productId, additionals, notes);
    
    if (cart[itemId]) {
        cart[itemId].quantity += quantity;
    } else {
        let totalPrice = product.price;
        let additionalsInfo = [];
        
        // Calcular preço dos adicionais
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
    updateFloatingCartCount();
    updateCartProgress();
    
    showFeedback(`${product.name} adicionado ao carrinho!`, 'success');
    
    // Animação do carrinho flutuante
    elements.floatingCart.style.animation = 'bounce 0.6s ease';
    setTimeout(() => {
        elements.floatingCart.style.animation = '';
    }, 600);
}

// Gerar ID único para item (considerando adicionais e observações)
function generateItemId(productId, additionals = [], notes = '') {
    const additionalsStr = additionals.sort().join(',');
    const notesStr = notes.trim().toLowerCase();
    return `${productId}_${additionalsStr}_${btoa(notesStr).replace(/[^a-zA-Z0-9]/g, '')}`;
}

// Abrir modal de personalização
function openCustomizeModal(productId) {
    const product = PRODUCTS[productId];
    if (!product) return;

    currentCustomizing = productId;
    
    // Atualizar título
    document.getElementById('customize-title').textContent = `Personalizar ${product.name}`;
    
    // Mostrar info do produto base
    document.getElementById('base-product-info').innerHTML = `
        <div class="base-product-name">${product.name}</div>
        <div class="base-product-price">R$ ${product.price.toFixed(2)}</div>
        <div style="font-size: 13px; color: #666; margin-top: 8px; line-height: 1.4;">${product.description}</div>
    `;
    
    // Limpar seleções anteriores
    document.querySelectorAll('input[name="additional"]').forEach(input => {
        input.checked = false;
    });
    document.getElementById('item-notes').value = '';
    
    updateCustomizeTotal();
    elements.customizeModal.style.display = 'flex';
    
    // Focar no modal
    setTimeout(() => {
        document.getElementById('item-notes').focus();
    }, 300);
}

// Fechar modal de personalização
function closeCustomizeModal() {
    elements.customizeModal.style.display = 'none';
    currentCustomizing = null;
}

// Atualizar total da personalização
function updateCustomizeTotal() {
    if (!currentCustomizing) return;
    
    const product = PRODUCTS[currentCustomizing];
    let total = product.price;
    
    document.querySelectorAll('input[name="additional"]:checked').forEach(input => {
        total += parseFloat(input.dataset.price);
    });
    
    document.getElementById('customize-total-value').textContent = `R$ ${total.toFixed(2)}`;
}

// Adicionar item personalizado ao carrinho
function addCustomizedToCart() {
    if (!currentCustomizing) return;
    
    const additionals = [];
    document.querySelectorAll('input[name="additional"]:checked').forEach(input => {
        additionals.push(input.value);
    });
    
    const notes = document.getElementById('item-notes').value.trim();
    
    addItemToCart(currentCustomizing, 1, additionals, notes);
    closeCustomizeModal();
}

// Atualizar contador do carrinho flutuante
function updateFloatingCartCount() {
    cartCount = 0;
    for (const itemId in cart) {
        cartCount += cart[itemId].quantity;
    }
    
    elements.cartCountBadge.textContent = cartCount;
    elements.cartCountBadge.style.display = cartCount > 0 ? 'flex' : 'none';
    
    // Animação quando adiciona item
    if (cartCount > 0) {
        elements.cartCountBadge.style.animation = 'bounce 0.3s ease';
        setTimeout(() => {
            elements.cartCountBadge.style.animation = '';
        }, 300);
    }
}

// Atualizar progresso do carrinho
function updateCartProgress() {
    const steps = document.querySelectorAll('.progress-step');
    const hasItems = Object.keys(cart).length > 0;
    
    // Step 1: Escolher (sempre ativo se tem itens)
    steps[0].classList.toggle('active', hasItems);
    
    // Steps 2 e 3 ficam inativos até o processo de finalização
    steps[1].classList.remove('active');
    steps[2].classList.remove('active');
}

// Atualizar exibição do carrinho
function updateCartDisplay() {
    elements.cartItems.innerHTML = '';
    
    let subtotal = 0;
    const itemCount = Object.keys(cart).length;
    
    if (itemCount === 0) {
        elements.cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Seu carrinho está vazio</h3>
                <p>Adicione alguns itens deliciosos para começar!</p>
            </div>
        `;
        elements.deliveryFeeContainer.style.display = 'none';
        elements.cartTotal.textContent = 'R$ 0,00';
        return;
    }
    
    // Renderizar itens do carrinho
    for (const itemId in cart) {
        const item = cart[itemId];
        const itemTotal = item.totalPrice * item.quantity;
        subtotal += itemTotal;
        
        const cartItemElement = createCartItemElement(itemId, item, itemTotal);
        elements.cartItems.appendChild(cartItemElement);
    }
    
    // Calcular total com taxa de entrega
    let total = subtotal;
    if (isDelivery && subtotal > 0) {
        elements.deliveryFeeContainer.style.display = 'block';
        elements.deliveryFeeValue.textContent = CONFIG.deliveryText;
        // Não adiciona taxa pois é "a combinar"
    } else {
        elements.deliveryFeeContainer.style.display = 'none';
    }
    
    elements.cartTotal.textContent = `R$ ${total.toFixed(2)}`;
}

// Criar elemento do item do carrinho
function createCartItemElement(itemId, item, itemTotal) {
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
            <button class="cart-qty-btn" data-item="${itemId}" data-action="decrease">-</button>
            <span>${item.quantity}</span>
            <button class="cart-qty-btn" data-item="${itemId}" data-action="increase">+</button>
        </div>
        <div class="cart-item-total">R$ ${itemTotal.toFixed(2)}</div>
    `;
    
    // Adicionar event listeners aos botões de quantidade
    cartItem.querySelectorAll('.cart-qty-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.dataset.item;
            const action = this.dataset.action;
            changeCartItemQuantity(itemId, action === 'increase' ? 1 : -1);
        });
    });
    
    return cartItem;
}

// Alterar quantidade no carrinho
function changeCartItemQuantity(itemId, change) {
    if (cart[itemId]) {
        cart[itemId].quantity += change;
        
        if (cart[itemId].quantity <= 0) {
            delete cart[itemId];
            showFeedback('Item removido do carrinho', 'info');
        }
        
        updateCartDisplay();
        updateFloatingCartCount();
        updateCartProgress();
    }
}

// Finalizar pedido
function finalizarPedido() {
    if (Object.keys(cart).length === 0) {
        showFeedback('Adicione itens ao carrinho antes de finalizar o pedido.', 'warning');
        return;
    }
    
    openCustomerModal();
}

// Abrir modal do cliente
function openCustomerModal() {
    // Atualizar progresso
    const steps = document.querySelectorAll('.progress-step');
    steps[0].classList.add('active');
    steps[1].classList.add('active');
    steps[2].classList.remove('active');
    
    if (isDelivery) {
        elements.modalTitle.textContent = 'Informações para Entrega';
        elements.deliveryFields.style.display = 'block';
        elements.localInstructions.style.display = 'none';
    } else {
        elements.modalTitle.textContent = 'Informações para Consumo no Local';
        elements.deliveryFields.style.display = 'none';
        elements.localInstructions.style.display = 'block';
    }
    
    elements.customerModal.style.display = 'flex';
    
    // Focar no primeiro campo
    setTimeout(() => {
        document.getElementById('customer-name').focus();
    }, 300);
}

// Fechar modal do cliente
function closeCustomerModal() {
    elements.customerModal.style.display = 'none';
    
    // Voltar progresso
    const steps = document.querySelectorAll('.progress-step');
    steps[1].classList.remove('active');
    steps[2].classList.remove('active');
}

// Buscar CEP
function buscarCep() {
    const cep = document.getElementById('customer-cep').value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        showFeedback('CEP inválido. Digite um CEP com 8 dígitos.', 'error');
        return;
    }
    
    const cepButton = document.getElementById('buscar-cep');
    const originalContent = cepButton.innerHTML;
    cepButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
    cepButton.disabled = true;
    
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                showFeedback('CEP não encontrado. Preencha o endereço manualmente.', 'warning');
                elements.addressFields.style.display = 'block';
            } else {
                document.getElementById('customer-address').value = data.logradouro || '';
                document.getElementById('customer-neighborhood').value = data.bairro || '';
                document.getElementById('customer-city').value = data.localidade || '';
                document.getElementById('customer-state').value = data.uf || '';
                
                elements.addressFields.style.display = 'block';
                document.getElementById('customer-number').focus();
                
                showFeedback('Endereço encontrado!', 'success');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar CEP:', error);
            showFeedback('Erro ao buscar CEP. Preencha o endereço manualmente.', 'error');
            elements.addressFields.style.display = 'block';
        })
        .finally(() => {
            cepButton.innerHTML = originalContent;
            cepButton.disabled = false;
        });
}

// Formatação de CEP
function formatarCep(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    e.target.value = value;
}

// Formatação de telefone
function formatarTelefone(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.length <= 2) {
            value = '(' + value;
        } else if (value.length <= 7) {
            value = '(' + value.substring(0, 2) + ') ' + value.substring(2);
        } else if (value.length <= 11) {
            value = '(' + value.substring(0, 2) + ') ' + value.substring(2, 7) + '-' + value.substring(7);
        } else {
            value = '(' + value.substring(0, 2) + ') ' + value.substring(2, 7) + '-' + value.substring(7, 11);
        }
    }
    e.target.value = value;
}

// Enviar pedido por WhatsApp
function enviarPedidoWhatsApp() {
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const notes = document.getElementById('customer-notes').value.trim();
    
    if (!name || !phone) {
        showFeedback('Por favor, preencha pelo menos seu nome e telefone.', 'error');
        return;
    }
    
    if (!isValidName(name)) {
        showFeedback('Digite um nome válido com pelo menos 2 caracteres.', 'error');
        document.getElementById('customer-name').focus();
        return;
    }
    
    if (!isValidPhone(phone)) {
        showFeedback('Digite um telefone válido.', 'error');
        document.getElementById('customer-phone').focus();
        return;
    }
    
    if (!validateForm()) return;
    
    // Atualizar progresso final
    const steps = document.querySelectorAll('.progress-step');
    steps[2].classList.add('active');
    
    const button = document.getElementById('enviar-whatsapp');
    const originalContent = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    button.disabled = true;
    
    setTimeout(() => {
        const message = buildWhatsAppMessage(name, phone, notes);
        
        // Enviar para WhatsApp
        window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${message}`, '_blank');
        
        // Limpar e fechar
        setTimeout(() => {
            clearFormAndCart();
            closeCustomerModal();
            showFeedback('Pedido enviado com sucesso! Aguarde nosso contato.', 'success');
        }, 1000);
        
        button.innerHTML = originalContent;
        button.disabled = false;
    }, 1500);
}

// Validar formulário
function validateForm() {
    if (isDelivery) {
        const address = document.getElementById('customer-address').value.trim();
        const number = document.getElementById('customer-number').value.trim();
        const neighborhood = document.getElementById('customer-neighborhood').value.trim();
        const city = document.getElementById('customer-city').value.trim();
        const state = document.getElementById('customer-state').value.trim();
        
        if (!address || !number || !neighborhood || !city || !state) {
            showFeedback('Para delivery, é necessário informar o endereço completo.', 'error');
            return false;
        }
    }
    return true;
}

// Construir mensagem do WhatsApp
function buildWhatsAppMessage(name, phone, notes) {
    const orderType = isDelivery ? 'Delivery' : 'Retirada no Local';
    const timestamp = new Date().toLocaleString('pt-BR');
    
    let message = `*🍔 NOVO PEDIDO - Costela do Titi*%0A%0A`;
    message += `*📅 Data/Hora:* ${timestamp}%0A`;
    message += `*👤 Cliente:* ${name}%0A`;
    message += `*📱 Telefone:* ${phone}%0A`;
    message += `*📍 Tipo:* ${orderType}%0A%0A`;
    
    // Endereço para delivery
    if (isDelivery) {
        const address = document.getElementById('customer-address').value.trim();
        const number = document.getElementById('customer-number').value.trim();
        const complement = document.getElementById('customer-complement').value.trim();
        const neighborhood = document.getElementById('customer-neighborhood').value.trim();
        const city = document.getElementById('customer-city').value.trim();
        const state = document.getElementById('customer-state').value.trim();
        
        message += `*🏠 ENDEREÇO DE ENTREGA:*%0A`;
        message += `${address}, ${number}`;
        if (complement) message += `, ${complement}`;
        message += `%0A${neighborhood} - ${city}/${state}%0A%0A`;
    }
    
    // Itens do pedido por categoria
    message += `*🛒 ITENS DO PEDIDO:*%0A%0A`;
    
    const categories = {
        'lanche': '🍔 *LANCHES*',
        'bebida': '🥤 *BEBIDAS*',
        'porcao': '🍟 *PORÇÕES*'
    };
    
    let subtotal = 0;
    
    // Agrupar por categoria
    const itemsByCategory = {};
    for (const itemId in cart) {
        const item = cart[itemId];
        const category = item.category || 'outros';
        
        if (!itemsByCategory[category]) {
            itemsByCategory[category] = [];
        }
        itemsByCategory[category].push({ itemId, ...item });
    }
    
    // Exibir itens por categoria
    Object.keys(itemsByCategory).forEach(category => {
        if (categories[category]) {
            message += `${categories[category]}%0A`;
        }
        
        itemsByCategory[category].forEach(item => {
            const itemTotal = item.totalPrice * item.quantity;
            subtotal += itemTotal;
            
            message += `• ${item.quantity}x ${item.name}`;
            
            if (item.additionalsInfo && item.additionalsInfo.length > 0) {
                message += ` (+ ${item.additionalsInfo.join(', ')})`;
            }
            
            message += ` - R$ ${itemTotal.toFixed(2)}`;
            
            if (item.notes) {
                message += `%0A  _💬 Obs: ${item.notes}_`;
            }
            
            message += `%0A`;
        });
        
        message += `%0A`;
    });
    
    // Taxa de entrega
    if (isDelivery) {
        message += `🚚 *Taxa de entrega:* ${CONFIG.deliveryText}%0A%0A`;
    }
    
    // Total
    message += `💰 *SUBTOTAL: R$ ${subtotal.toFixed(2)}*%0A`;
    if (isDelivery) {
        message += `💰 *TOTAL: R$ ${subtotal.toFixed(2)} + taxa de entrega a combinar*%0A%0A`;
    } else {
        message += `💰 *TOTAL: R$ ${subtotal.toFixed(2)}*%0A%0A`;
    }
    
    // Observações gerais
    if (notes) {
        message += `📝 *OBSERVAÇÕES:* ${notes}%0A%0A`;
    }
    
    // Instruções finais
    if (isDelivery) {
        message += `🚚 *DELIVERY*%0A`;
        message += `⏱️ Tempo estimado: ${CONFIG.prepareTime} minutos%0A`;
        message += `📞 Entraremos em contato para confirmar o pedido e combinar a taxa de entrega!%0A%0A`;
    } else {
        message += `🏪 *RETIRADA NO LOCAL*%0A`;
        message += `⏱️ Tempo estimado: ${CONFIG.prepareTime} minutos%0A`;
        message += `📞 Avisaremos quando estiver pronto para retirada!%0A%0A`;
    }
    
    message += `🌐 _Pedido realizado via site_`;
    
    return encodeURIComponent(message);
}

// Limpar formulário e carrinho
function clearFormAndCart() {
    // Limpar carrinho
    cart = {};
    cartCount = 0;
    
    // Limpar formulário
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-phone').value = '';
    document.getElementById('customer-cep').value = '';
    document.getElementById('customer-address').value = '';
    document.getElementById('customer-number').value = '';
    document.getElementById('customer-complement').value = '';
    document.getElementById('customer-neighborhood').value = '';
    document.getElementById('customer-city').value = '';
    document.getElementById('customer-state').value = '';
    document.getElementById('customer-notes').value = '';
    
    // Resetar quantidades dos produtos
    document.querySelectorAll('.qty-value').forEach(element => {
        element.textContent = '0';
    });
    
    // Esconder campos de endereço
    elements.addressFields.style.display = 'none';
    
    // Atualizar displays
    updateCartDisplay();
    updateFloatingCartCount();
    updateCartProgress();
}

// Mostrar feedback para o usuário
function showFeedback(message, type = 'info') {
    // Remover feedback anterior se existir
    const existingFeedback = document.querySelector('.feedback-message');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Criar novo feedback
    const feedback = document.createElement('div');
    feedback.className = `feedback-message feedback-${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' :
                 type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    
    feedback.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(feedback);
    
    // Mostrar feedback
    requestAnimationFrame(() => {
        feedback.classList.add('show');
    });
    
    // Remover após 4 segundos
    setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 300);
    }, 4000);
}

// Função para debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função para validar telefone
function isValidPhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
}

// Função para validar nome
function isValidName(name) {
    return name.trim().length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(name.trim());
}

// Validação em tempo real
document.addEventListener('DOMContentLoaded', function() {
    // Validação de nome
    const nameInput = document.getElementById('customer-name');
    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            if (this.value && !isValidName(this.value)) {
                this.style.borderColor = '#dc3545';
                showFeedback('Nome deve ter pelo menos 2 caracteres e conter apenas letras', 'error');
            } else if (this.value) {
                this.style.borderColor = '#28a745';
            } else {
                this.style.borderColor = '#e0e0e0';
            }
        });
    }
    
    // Validação de telefone
    const phoneInput = document.getElementById('customer-phone');
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            if (this.value && !isValidPhone(this.value)) {
                this.style.borderColor = '#dc3545';
                showFeedback('Digite um telefone válido', 'error');
            } else if (this.value) {
                this.style.borderColor = '#28a745';
            } else {
                this.style.borderColor = '#e0e0e0';
            }
        });
    }
});

// Listener para tecla ESC fechar modais
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (elements.customizeModal.style.display === 'flex') {
            closeCustomizeModal();
        }
        if (elements.customerModal.style.display === 'flex') {
            closeCustomerModal();
        }
    }
});

// Adicionar animação CSS personalizada para shake
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .feedback-message {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;
document.head.appendChild(style);

// Console log para debugging (remover em produção)
console.log('🍔 Sistema Costela do Titi carregado com sucesso!');
console.log(`📦 Produtos disponíveis: ${Object.keys(PRODUCTS).length}`);
console.log(`➕ Adicionais disponíveis: ${Object.keys(ADDITIONALS).length}`);
console.log(`📱 WhatsApp configurado: ${CONFIG.whatsappNumber}`);