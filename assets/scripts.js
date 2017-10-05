/* ============================================================
  Initial variables
============================================================= */
var cart;
var cartLineItemCount;

/* ============================================================
  Initiate ShopifyBuy client
============================================================= */
var shopClient = ShopifyBuy.buildClient({
  accessToken: '4d4c4181de6648ffd56fbb467fe79f37',
  domain: 'squidz-apparel.myshopify.com',
  appId: '6'
});

/* ============================================================
  Check to see if we have a cart stored in localstorage. If so,
  grab that one instead of starting a new one.
============================================================= */
if(localStorage.getItem('lastCartId')) {
  shopClient.fetchCart(localStorage.getItem('lastCartId')).then(function(remoteCart) {
    console.log('cart', remoteCart)
    cart = remoteCart;
    cartLineItemCount = remoteCart.lineItemCount;
  });
} else {
  shopClient.createCart().then(function (newCart) {
    cart = newCart;
    localStorage.setItem('lastCartId', cart.id);
    cartLineItemCount = newCart.lineItemCount;
  });
}

/* ============================================================
  Document ready for functions which require jQuery.
============================================================= */
$(function(){
  cartCount();
});

/* ============================================================
  Checks the current cart count and applies it to the cart
  count in the header.
============================================================= */
function cartCount(){
  if(cartLineItemCount > 0){
    $('.cart-count').addClass('has-items').text(cartLineItemCount)
  }
}

function buildCart(){
  var cartHTML = cart.lineItems.map(function (lineItem) {
    return '\
    <div class="cart-row">\
      <div class="grid">\
        <div class="col-2">\
          <img src="'+lineItem.image.variants[5].src+'">\
        </div>\
        <div class="col-4">\
          <h3>'+lineItem.title+'</h3>\
          <p><em>'+lineItem.variant_title+'</em></p>\
        </div>\
        <div class="col-2 text-right">\
          <h3>'+lineItem.price+'</h3>\
        </div>\
        <div class="col-2 text-right">\
          <input class="quantity" type="number" value="'+lineItem.quantity+'" data-variant-id="'+lineItem.variant_id+'" />\
        </div>\
        <div class="col-2 text-right">\
          <h3>'+lineItem.line_price+'</h3>\
        </div>\
      </div>\
    </div>';
  });
  $('#cart').append(cartHTML);
}

/* ============================================================
  Finds the Cart Line Item by Variant ID
============================================================= */
function findCartItemByVariantId(variantId) {
  return cart.lineItems.filter(function (item) {
    return (item.variant_id === variantId);
  })[0];
}

/* ============================================================
  Determine action for variant adding/updating/removing
============================================================= */
function addOrUpdateVariant(variantID, quantity) {
  var cartLineItem = findCartItemByVariantId(variantID);
  console.log(cartLineItem)
  if (cartLineItem) {
    updateVariantInCart(cartLineItem, quantity);
  } else {
    addVariantToCart(variant, quantity);
  }
}

/* ============================================================
  Update details for item already in cart. Remove if necessary
============================================================= */
  function updateVariantInCart(cartLineItem, quantity) {
    var variantId = cartLineItem.variant_id;
    var cartLength = cart.lineItems.length;
    cart.updateLineItem(cartLineItem.id, quantity).then(function(updatedCart) {
      buildCart();
    }).catch(function (errors) {
      console.log('Fail');
      console.error(errors);
    });
  }