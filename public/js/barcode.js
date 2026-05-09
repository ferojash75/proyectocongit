/**
 * barcode.js
 * Lógica para captura de códigos de barra con lector manual (USB/HID).
 *
 * Los lectores USB actúan como teclado: escriben el código y envían Enter.
 * También se admite entrada manual por teclado.
 */

(function () {
  'use strict';

  // ── Referencias al DOM ──────────────────────────────────────────────────
  const barcodeInput      = document.getElementById('barcode-input');
  const btnBuscar         = document.getElementById('btn-buscar');
  const btnLimpiar        = document.getElementById('btn-limpiar');
  const loader            = document.getElementById('loader');
  const resultadoProducto = document.getElementById('resultado-producto');
  const resultadoError    = document.getElementById('resultado-error');
  const scannerStatus     = document.getElementById('scanner-status');

  // Campos del producto encontrado
  const prodNombre      = document.getElementById('prod-nombre');
  const prodDescripcion = document.getElementById('prod-descripcion');
  const prodCategoria   = document.getElementById('prod-categoria');
  const prodBarcode     = document.getElementById('prod-barcode');
  const prodPrecio      = document.getElementById('prod-precio');
  const prodStock       = document.getElementById('prod-stock');
  const errorCodigo     = document.getElementById('error-codigo');

  // Carrito
  const btnAgregarCarrito = document.getElementById('btn-agregar-carrito');
  const cantidadInput     = document.getElementById('cantidad-input');
  const btnMenos          = document.getElementById('btn-menos');
  const btnMas            = document.getElementById('btn-mas');
  const seccionCarrito    = document.getElementById('seccion-carrito');
  const carritoItems      = document.getElementById('carrito-items');
  const carritoTotal      = document.getElementById('carrito-total');
  const btnVaciarCarrito  = document.getElementById('btn-vaciar-carrito');

  // ── Estado interno ──────────────────────────────────────────────────────
  let productoActual = null;
  let carrito = [];           // [{ producto, cantidad }]
  let scannerTimer = null;    // Temporizador para detectar input rápido del scanner
  const SCANNER_DELAY_MS = 100; // Lectores envían caracteres muy rápido

  // ── Utilidades ───────────────────────────────────────────────────────────

  function formatearPrecio(valor) {
    return '$' + parseFloat(valor).toFixed(2);
  }

  function setStatus(tipo, mensaje) {
    const iconos = {
      info:    'bi-info-circle-fill',
      success: 'bi-check-circle-fill',
      danger:  'bi-exclamation-triangle-fill',
      warning: 'bi-exclamation-circle-fill',
    };
    const icono = iconos[tipo] || iconos.info;
    scannerStatus.className = `alert alert-${tipo} d-flex align-items-center mb-3`;
    scannerStatus.innerHTML = `<i class="bi ${icono} me-2"></i><span>${mensaje}</span>`;
  }

  function mostrarLoader(visible) {
    loader.classList.toggle('d-none', !visible);
  }

  function ocultarResultados() {
    resultadoProducto.classList.add('d-none');
    resultadoError.classList.add('d-none');
  }

  // ── Búsqueda por código de barra ─────────────────────────────────────────

  async function buscarProducto(codigo) {
    codigo = codigo.trim();
    if (!codigo) return;

    ocultarResultados();
    mostrarLoader(true);
    setStatus('info', `Buscando código: <strong>${codigo}</strong>…`);

    try {
      const resp = await fetch(`/api/productos/barcode/${encodeURIComponent(codigo)}`);
      const data = await resp.json();

      if (resp.ok && data.producto) {
        mostrarProducto(data.producto);
      } else {
        mostrarError(codigo);
      }
    } catch (err) {
      console.error('Error de red:', err);
      setStatus('danger', 'No se pudo conectar con el servidor. Verifica tu conexión.');
      mostrarLoader(false);
    }
  }

  function mostrarProducto(producto) {
    productoActual = producto;
    mostrarLoader(false);

    prodNombre.textContent      = producto.nombre;
    prodDescripcion.textContent = producto.descripcion || 'Sin descripción';
    prodCategoria.textContent   = producto.categoria   || 'Sin categoría';
    prodBarcode.textContent     = producto.codigo_barra || '—';
    prodPrecio.textContent      = formatearPrecio(producto.precio);
    prodStock.textContent       = producto.stock;

    // Alerta de stock bajo
    prodStock.className = producto.stock > 10
      ? 'fw-semibold text-success'
      : producto.stock > 0
        ? 'fw-semibold text-warning'
        : 'fw-semibold text-danger';

    cantidadInput.value = 1;
    cantidadInput.max   = producto.stock;

    resultadoProducto.classList.remove('d-none');
    resultadoError.classList.add('d-none');

    setStatus('success', `Producto encontrado: <strong>${producto.nombre}</strong>`);

    // Devolver foco al input para el próximo escaneo
    barcodeInput.value = '';
    barcodeInput.focus();
  }

  function mostrarError(codigo) {
    mostrarLoader(false);
    productoActual = null;

    errorCodigo.textContent = `Código: ${codigo}`;
    resultadoError.classList.remove('d-none');
    resultadoProducto.classList.add('d-none');

    setStatus('danger', `No se encontró ningún producto con el código <strong>${codigo}</strong>.`);

    barcodeInput.value = '';
    barcodeInput.focus();
  }

  // ── Eventos del input (captura de scanner) ───────────────────────────────

  /**
   * Los lectores de barra USB envían los caracteres muy rápido (~5-50ms entre teclas)
   * y luego envían Enter (keyCode 13).
   * Estrategia: detectar Enter → buscar inmediatamente.
   * Alternativa por timeout: si el usuario pega o el scanner envía sin Enter,
   * el timer de SCANNER_DELAY_MS detecta pausa en la escritura.
   */
  barcodeInput.addEventListener('keydown', function (e) {
    // Limpiar timer anterior
    clearTimeout(scannerTimer);

    if (e.key === 'Enter') {
      e.preventDefault();
      const codigo = barcodeInput.value.trim();
      if (codigo) buscarProducto(codigo);
      return;
    }

    // Timer de detección de pausa (útil si el scanner no envía Enter)
    scannerTimer = setTimeout(function () {
      const codigo = barcodeInput.value.trim();
      if (codigo.length >= 4) {
        // Solo activar si parece un código de barra (largo suficiente)
        // y no hay más entrada en los últimos SCANNER_DELAY_MS ms
      }
    }, SCANNER_DELAY_MS);
  });

  // Botón buscar manual
  btnBuscar.addEventListener('click', function () {
    const codigo = barcodeInput.value.trim();
    if (codigo) buscarProducto(codigo);
  });

  // Botón limpiar
  btnLimpiar.addEventListener('click', function () {
    barcodeInput.value = '';
    ocultarResultados();
    setStatus('info', 'Listo para escanear. Conecta tu lector o escribe el código abajo.');
    productoActual = null;
    barcodeInput.focus();
  });

  // ── Cantidad ─────────────────────────────────────────────────────────────

  btnMenos.addEventListener('click', function () {
    const val = parseInt(cantidadInput.value, 10);
    if (val > 1) cantidadInput.value = val - 1;
  });

  btnMas.addEventListener('click', function () {
    const val = parseInt(cantidadInput.value, 10);
    const max = parseInt(cantidadInput.max, 10) || Infinity;
    if (val < max) cantidadInput.value = val + 1;
  });

  // ── Carrito ───────────────────────────────────────────────────────────────

  btnAgregarCarrito.addEventListener('click', function () {
    if (!productoActual) return;

    const cantidad = parseInt(cantidadInput.value, 10);
    if (isNaN(cantidad) || cantidad < 1) return;

    // Si el producto ya está en el carrito, sumar cantidad
    const existente = carrito.find(function (item) {
      return item.producto.id === productoActual.id;
    });

    if (existente) {
      existente.cantidad += cantidad;
    } else {
      carrito.push({ producto: { ...productoActual }, cantidad });
    }

    renderizarCarrito();
    setStatus('success', `<strong>${cantidad}x ${productoActual.nombre}</strong> agregado al carrito.`);
  });

  btnVaciarCarrito.addEventListener('click', function () {
    carrito = [];
    renderizarCarrito();
    setStatus('info', 'Carrito vaciado. Listo para escanear.');
  });

  function renderizarCarrito() {
    carritoItems.innerHTML = '';
    let total = 0;

    carrito.forEach(function (item, index) {
      const subtotal = item.cantidad * parseFloat(item.producto.precio);
      total += subtotal;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <span class="fw-semibold">${item.producto.nombre}</span>
          <br><small class="text-muted font-monospace">${item.producto.codigo_barra || ''}</small>
        </td>
        <td class="text-center">
          <input type="number" class="form-control form-control-sm text-center carrito-cantidad"
            value="${item.cantidad}" min="1" data-index="${index}" style="width:70px;margin:auto;">
        </td>
        <td class="text-end">${formatearPrecio(item.producto.precio)}</td>
        <td class="text-end fw-semibold text-success">${formatearPrecio(subtotal)}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-outline-danger btn-eliminar-item" data-index="${index}" title="Eliminar">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      carritoItems.appendChild(tr);
    });

    carritoTotal.textContent = formatearPrecio(total);

    // Mostrar u ocultar sección del carrito
    seccionCarrito.classList.toggle('d-none', carrito.length === 0);

    // Listeners para cantidad editable en carrito
    document.querySelectorAll('.carrito-cantidad').forEach(function (input) {
      input.addEventListener('change', function () {
        const idx = parseInt(this.dataset.index, 10);
        const val = parseInt(this.value, 10);
        if (val >= 1) {
          carrito[idx].cantidad = val;
          renderizarCarrito();
        }
      });
    });

    // Listeners para eliminar ítems
    document.querySelectorAll('.btn-eliminar-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const idx = parseInt(this.dataset.index, 10);
        carrito.splice(idx, 1);
        renderizarCarrito();
      });
    });
  }

  // ── Auto-focus en el input al cargar la página ────────────────────────────
  barcodeInput.focus();

  // Redirigir el foco al input si el usuario hace clic fuera de un campo de texto
  document.addEventListener('click', function (e) {
    const tagName = (e.target.tagName || '').toUpperCase();
    const isInteractivo = ['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA', 'A'].includes(tagName);
    if (!isInteractivo) {
      barcodeInput.focus();
    }
  });

})();
