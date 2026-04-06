<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  export let x: number;
  export let y: number;
  export let z: number;

  let container: HTMLDivElement;
  let webglAvailable = true;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let vectorArrow: THREE.Group;

  onMount(() => {
    try {
      // Inicializar escena
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf5f5f5);

      // Inicializar cámara
      camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.set(600, 300, 600);
      camera.lookAt(0, 0, 0);

      // Inicializar renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);

      // Agregar luces
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(500, 500, 500);
      scene.add(directionalLight);

      // Dibujar ejes
      drawAxes();

      // Crear y agregar el vector
      vectorArrow = new THREE.Group();
      updateVector();
      scene.add(vectorArrow);

      // Animación
      function animate() {
        requestAnimationFrame(animate);
        vectorArrow.rotation.y += 0.003;
        renderer.render(scene, camera);
      }
      animate();

      // Manejar redimensionamiento
      const handleResize = () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    } catch (error) {
      console.error('WebGL error:', error);
      webglAvailable = false;
      
      // Fallback a Canvas 2D con proyección isométrica 3D
      setTimeout(() => {
        if (container) {
          canvas = document.createElement('canvas');
          canvas.width = container.clientWidth;
          canvas.height = container.clientHeight;
          ctx = canvas.getContext('2d')!;
          container.appendChild(canvas);
          
          // Proyección isométrica 3D
          function project3D(x3d: number, y3d: number, z3d: number) {
            // Ángulos isométricos
            const angle1 = Math.PI / 6; // 30 grados
            const angle2 = Math.PI / 4; // 45 grados
            
            const x2d = (x3d * Math.cos(angle2) - z3d * Math.sin(angle2)) * 0.5;
            const y2d = -y3d * 0.5 - (x3d * Math.sin(angle1) + z3d * Math.cos(angle1)) * 0.3;
            
            return { x: x2d, y: y2d };
          }
          
          function drawBoundingBox(centerX: number, centerY: number, maxX: number, maxY: number, maxZ: number) {
            // Definir los 8 vértices del cubo
            const vertices = [
              { x: 0, y: 0, z: 0, label: '(0,0,0)' },      // 0: origen
              { x: maxX, y: 0, z: 0, label: `(${maxX.toFixed(0)},0,0)` },   // 1
              { x: maxX, y: maxY, z: 0, label: `(${maxX.toFixed(0)},${maxY.toFixed(0)},0)` }, // 2
              { x: 0, y: maxY, z: 0, label: `(0,${maxY.toFixed(0)},0)` },   // 3
              { x: 0, y: 0, z: maxZ, label: `(0,0,${maxZ.toFixed(0)})` },   // 4
              { x: maxX, y: 0, z: maxZ, label: `(${maxX.toFixed(0)},0,${maxZ.toFixed(0)})` }, // 5
              { x: maxX, y: maxY, z: maxZ, label: `(${maxX.toFixed(0)},${maxY.toFixed(0)},${maxZ.toFixed(0)})` }, // 6
              { x: 0, y: maxY, z: maxZ, label: `(0,${maxY.toFixed(0)},${maxZ.toFixed(0)})` }  // 7
            ];
            
            // Proyectar todos los vértices
            const projVertices = vertices.map(v => {
              const proj = project3D(v.x, v.y, v.z);
              return {
                x: centerX + proj.x,
                y: centerY + proj.y,
                label: v.label
              };
            });
            
            // Aristas del cubo: pares de índices de vértices
            // Aristas visibles (línea sólida)
            const visibleEdges = [
              [0, 1], [1, 2], [2, 3], [3, 0], // Base
              [4, 5], [5, 6], [6, 7], [7, 4]  // Tapa
            ];
            
            // Aristas ocultas (línea punteada)
            const hiddenEdges = [
              [0, 4], [1, 5], [2, 6], [3, 7]  // Aristas verticales
            ];
            
            // Dibujar aristas visibles
            ctx.strokeStyle = 'rgba(120, 130, 180, 0.6)';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([]);
            
            visibleEdges.forEach((edge: number[]) => {
              const [start, end] = edge;
              ctx.beginPath();
              ctx.moveTo(projVertices[start].x, projVertices[start].y);
              ctx.lineTo(projVertices[end].x, projVertices[end].y);
              ctx.stroke();
            });
            
            // Dibujar aristas ocultas (punteadas)
            ctx.strokeStyle = 'rgba(120, 130, 180, 0.25)';
            ctx.setLineDash([5, 5]);
            
            hiddenEdges.forEach((edge: number[]) => {
              const [start, end] = edge;
              ctx.beginPath();
              ctx.moveTo(projVertices[start].x, projVertices[start].y);
              ctx.lineTo(projVertices[end].x, projVertices[end].y);
              ctx.stroke();
            });
            
            ctx.setLineDash([]);
            
            // Dibujar vértices como puntos y etiquetas
            projVertices.forEach((vertex, idx) => {
              // Sombra del vértice
              ctx.fillStyle = 'rgba(120, 130, 180, 0.15)';
              ctx.beginPath();
              ctx.arc(vertex.x + 1, vertex.y + 1, 6, 0, Math.PI * 2);
              ctx.fill();
              
              // Punto del vértice
              ctx.fillStyle = 'rgba(120, 130, 180, 0.9)';
              ctx.beginPath();
              ctx.arc(vertex.x, vertex.y, 5, 0, Math.PI * 2);
              ctx.fill();
              
              // Borde del vértice
              ctx.strokeStyle = '#667eea';
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.arc(vertex.x, vertex.y, 5, 0, Math.PI * 2);
              ctx.stroke();
              
              // Etiquetas de vértices (con fondo)
              const labelText = vertex.label;
              ctx.font = '10px "Segoe UI", Arial';
              const textMetrics = ctx.measureText(labelText);
              const labelX = vertex.x + 8;
              const labelY = vertex.y - 12;
              
              // Fondo de la etiqueta
              ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
              ctx.fillRect(labelX - 2, labelY - 11, textMetrics.width + 4, 12);
              
              ctx.fillStyle = '#333';
              ctx.fillText(labelText, labelX, labelY - 1);
            });
            
            return projVertices;
          }
          
          function drawAxisWithScale(centerX: number, centerY: number, startPt: any, endPt: any, axisName: string, color: string, maxVal: number) {
            // Dibujar eje principal
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(startPt.x, startPt.y);
            ctx.lineTo(endPt.x, endPt.y);
            ctx.stroke();
            
            // Marcar divisiones en el eje
            const divisions = 5;
            for (let i = 0; i <= divisions; i++) {
              const t = i / divisions;
              const markX = startPt.x + (endPt.x - startPt.x) * t;
              const markY = startPt.y + (endPt.y - startPt.y) * t;
              
              // Pequeña marca perpendicular
              const dx = endPt.x - startPt.x;
              const dy = endPt.y - startPt.y;
              const len = Math.sqrt(dx * dx + dy * dy);
              const perpX = -dy / len * 6;
              const perpY = dx / len * 6;
              
              ctx.strokeStyle = color;
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(markX - perpX, markY - perpY);
              ctx.lineTo(markX + perpX, markY + perpY);
              ctx.stroke();
              
              // Punto pequeño en la marca
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(markX, markY, 2.5, 0, Math.PI * 2);
              ctx.fill();
              
              // Valor en la marca
              const val = (maxVal * t).toFixed(0);
              ctx.fillStyle = color;
              ctx.font = '10px "Segoe UI", Arial';
              ctx.fillText(val, markX - perpX - 18, markY - perpY - 8);
            }
            
            // Etiqueta del eje con fondo
            ctx.fillStyle = color;
            ctx.font = 'bold 16px "Segoe UI", Arial';
            ctx.fillText(axisName, endPt.x + 12, endPt.y + 5);
          }
          
          function draw3D() {
            // Fondo con gradiente
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(1, '#f8f9ff');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Línea de grid sutil
            ctx.strokeStyle = 'rgba(200, 200, 200, 0.15)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < canvas.width; i += 50) {
              ctx.beginPath();
              ctx.moveTo(i, 0);
              ctx.lineTo(i, canvas.height);
              ctx.stroke();
            }
            for (let i = 0; i < canvas.height; i += 50) {
              ctx.beginPath();
              ctx.moveTo(0, i);
              ctx.lineTo(canvas.width, i);
              ctx.stroke();
            }
            
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            // Calcular límites dinámicos basados en los valores del vector
            const maxXVal = Math.max(x * 100 * 1.2, 100);
            const maxYVal = Math.max(y * 1.2, 100);
            const maxZVal = Math.max(z * 1.2, 100);
            
            // Dibujar caja delimitadora con límites dinámicos
            const projVertices = drawBoundingBox(centerX, centerY, maxXVal, maxYVal, maxZVal);
            
            // Proyectar origen
            const origin = project3D(0, 0, 0);
            const originX = centerX + origin.x;
            const originY = centerY + origin.y;
            
            // Marca origen
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(originX, originY, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Proyectar extremos de los ejes con los mismos límites que la caja
            const axisX = project3D(maxXVal, 0, 0);
            const axisY = project3D(0, maxYVal, 0);
            const axisZ = project3D(0, 0, maxZVal);
            
            const endX = { x: originX + axisX.x, y: originY + axisX.y };
            const endY = { x: originX + axisY.x, y: originY + axisY.y };
            const endZ = { x: originX + axisZ.x, y: originY + axisZ.y };
            
            // Dibujar ejes con escala
            drawAxisWithScale(centerX, centerY, { x: originX, y: originY }, endX, 'X', '#ff3b30', maxXVal);
            drawAxisWithScale(centerX, centerY, { x: originX, y: originY }, endY, 'Y', '#34c759', maxYVal);
            drawAxisWithScale(centerX, centerY, { x: originX, y: originY }, endZ, 'Z', '#007aff', maxZVal);
            
            // Proyectar vector
            const vectorProj = project3D(x * 100, y, z);
            const vectorX2D = originX + vectorProj.x;
            const vectorY2D = originY + vectorProj.y;
            
            // Sombra del vector
            ctx.strokeStyle = 'rgba(102, 126, 234, 0.15)';
            ctx.lineWidth = 6;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(originX + 2, originY + 2);
            ctx.lineTo(vectorX2D + 2, vectorY2D + 2);
            ctx.stroke();
            
            // Dibujar línea del vector
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 5;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(originX, originY);
            ctx.lineTo(vectorX2D, vectorY2D);
            ctx.stroke();
            
            // Punta de flecha mejorada
            const angleVec = Math.atan2(vectorY2D - originY, vectorX2D - originX);
            const arrowSize = 25;
            ctx.fillStyle = '#667eea';
            ctx.beginPath();
            ctx.moveTo(vectorX2D, vectorY2D);
            ctx.lineTo(
              vectorX2D - arrowSize * Math.cos(angleVec - Math.PI / 6),
              vectorY2D - arrowSize * Math.sin(angleVec - Math.PI / 6)
            );
            ctx.lineTo(
              vectorX2D - arrowSize * Math.cos(angleVec + Math.PI / 6),
              vectorY2D - arrowSize * Math.sin(angleVec + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fill();
            
            // Punto final del vector con sombra
            ctx.fillStyle = 'rgba(102, 126, 234, 0.2)';
            ctx.beginPath();
            ctx.arc(vectorX2D + 1, vectorY2D + 1, 10, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#667eea';
            ctx.beginPath();
            ctx.arc(vectorX2D, vectorY2D, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Etiqueta del punto final del vector (con fondo)
            ctx.fillStyle = '#f5f5f5';
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 1;
            const labelText = `F(${x.toFixed(2)},${y.toFixed(2)},${z.toFixed(2)})`;
            ctx.font = 'bold 12px "Segoe UI", Arial';
            const textMetrics = ctx.measureText(labelText);
            const labelPadding = 6;
            const labelX = vectorX2D + 12;
            const labelY = vectorY2D - 15;
            
            // Fondo redondeado para la etiqueta
            const cornerRadius = 5;
            ctx.beginPath();
            ctx.moveTo(labelX + cornerRadius, labelY - 15);
            ctx.lineTo(labelX + textMetrics.width + labelPadding, labelY - 15);
            ctx.quadraticCurveTo(labelX + textMetrics.width + labelPadding + cornerRadius, labelY - 15, 
                                 labelX + textMetrics.width + labelPadding + cornerRadius, labelY - 15 + cornerRadius);
            ctx.lineTo(labelX + textMetrics.width + labelPadding + cornerRadius, labelY - 5);
            ctx.quadraticCurveTo(labelX + textMetrics.width + labelPadding + cornerRadius, labelY - 5 + cornerRadius,
                                 labelX + textMetrics.width + labelPadding, labelY - 5 + cornerRadius);
            ctx.lineTo(labelX + cornerRadius, labelY - 5 + cornerRadius);
            ctx.quadraticCurveTo(labelX, labelY - 5 + cornerRadius, labelX, labelY - 5);
            ctx.lineTo(labelX, labelY - 15 + cornerRadius);
            ctx.quadraticCurveTo(labelX, labelY - 15, labelX + cornerRadius, labelY - 15);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            ctx.fillStyle = '#667eea';
            ctx.fillText(labelText, labelX + labelPadding / 2, labelY - 4);
            
            // Calcular ángulo del vector respecto al eje Y
            const magnitude = Math.sqrt(x*x + y*y + z*z);
            const angleWithY = Math.acos(y / magnitude) * (180 / Math.PI);
            
            // Dibujar línea de referencia para el ángulo (al eje Y)
            const angleLineLength = 60;
            const angleEndX = originX + endY.x / (maxYVal * 0.5) * angleLineLength;
            const angleEndY = originY + endY.y / (maxYVal * 0.5) * angleLineLength;
            
            ctx.strokeStyle = 'rgba(255, 165, 0, 0.3)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(originX, originY);
            ctx.lineTo(angleEndX, angleEndY);
            ctx.stroke();
            
            // Dibujar el arco del ángulo
            ctx.strokeStyle = '#ff9500';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([]);
            
            const startAngle = Math.atan2(angleEndY - originY, angleEndX - originX);
            const endAngle = angleVec;
            const angleRadius = 45;
            
            ctx.beginPath();
            ctx.arc(originX, originY, angleRadius, startAngle, endAngle, true);
            ctx.stroke();
            
            // Etiqueta del ángulo (con fondo)
            const midAngle = (startAngle + endAngle) / 2;
            const labelX2 = originX + Math.cos(midAngle) * (angleRadius + 25);
            const labelY2 = originY + Math.sin(midAngle) * (angleRadius + 25);
            const angleText = `θ = ${angleWithY.toFixed(2)}°`;
            
            ctx.fillStyle = '#fff8f0';
            ctx.strokeStyle = '#ff9500';
            ctx.lineWidth = 1;
            const textMetrics2 = ctx.measureText(angleText);
            ctx.beginPath();
            ctx.moveTo(labelX2 - textMetrics2.width / 2 - 6, labelY2 - 12);
            ctx.lineTo(labelX2 + textMetrics2.width / 2 + 6, labelY2 - 12);
            ctx.lineTo(labelX2 + textMetrics2.width / 2 + 6, labelY2 + 5);
            ctx.lineTo(labelX2 - textMetrics2.width / 2 - 6, labelY2 + 5);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            ctx.fillStyle = '#ff9500';
            ctx.font = 'bold 12px "Segoe UI", Arial';
            ctx.textAlign = 'center';
            ctx.fillText(angleText, labelX2, labelY2);
            ctx.textAlign = 'left';
            
            // Líneas punteadas para mostrar proyecciones (más sutiles)
            ctx.strokeStyle = 'rgba(102, 126, 234, 0.2)';
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            
            // Proyección en plano XY
            const projXY = project3D(x * 100, y, 0);
            ctx.beginPath();
            ctx.moveTo(originX + projXY.x, originY + projXY.y);
            ctx.lineTo(vectorX2D, vectorY2D);
            ctx.stroke();
            
            // Proyección en plano XZ
            const projXZ = project3D(x * 100, 0, z);
            ctx.beginPath();
            ctx.moveTo(originX + projXZ.x, originY + projXZ.y);
            ctx.lineTo(vectorX2D, vectorY2D);
            ctx.stroke();
            
            ctx.setLineDash([]);
            
            // Panel de información mejorado
            const panelX = 15;
            const panelY = 25;
            const panelWidth = 280;
            const panelHeight = 90;
            
            // Fondo del panel
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 2;
            ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
            ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
            
            // Contenido del panel
            ctx.fillStyle = '#333';
            ctx.font = 'bold 13px "Segoe UI", Arial';
            ctx.fillText('Vector Información', panelX + 10, panelY + 22);
            
            ctx.font = '12px "Segoe UI", Arial';
            ctx.fillStyle = '#555';
            ctx.fillText(`F(t) = (${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})`, panelX + 10, panelY + 42);
            ctx.fillText(`Magnitud: ${magnitude.toFixed(2)} u`, panelX + 10, panelY + 58);
            ctx.fillText(`Ángulo (Y): ${angleWithY.toFixed(2)}°`, panelX + 10, panelY + 74);
            
            // Escala de referencia
            ctx.fillStyle = '#999';
            ctx.font = '11px "Segoe UI", Arial';
            ctx.fillText('Proyección Isométrica 3D', canvas.width - 190, canvas.height - 12);
          }
          
          let rotationAngle = 0;
          let isRotating = true;
          
          function drawAnimated() {
            rotationAngle += 0.01;
            draw3D();
            requestAnimationFrame(drawAnimated);
          }
          
          drawAnimated();
          
          window.addEventListener('resize', () => {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
          });
        }
      }, 0);
    }
  });

  function drawAxes() {
    const axisLength = 600;

    // Eje X (Rojo)
    const xGeometry = new THREE.BufferGeometry();
    xGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0, axisLength, 0, 0]), 3));
    const xLine = new THREE.Line(xGeometry, new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 }));
    scene.add(xLine);

    // Eje Y (Verde)
    const yGeometry = new THREE.BufferGeometry();
    yGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0, 0, axisLength, 0]), 3));
    const yLine = new THREE.Line(yGeometry, new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 }));
    scene.add(yLine);

    // Eje Z (Azul)
    const zGeometry = new THREE.BufferGeometry();
    zGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0, 0, 0, axisLength]), 3));
    const zLine = new THREE.Line(zGeometry, new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 2 }));
    scene.add(zLine);

    // Etiquetas de ejes
    addAxisLabel('X', [axisLength + 30, 0, 0], 0xff0000);
    addAxisLabel('Y', [0, axisLength + 30, 0], 0x00ff00);
    addAxisLabel('Z', [0, 0, axisLength + 30], 0x0000ff);
  }

  function addAxisLabel(text: string, position: [number, number, number], color: number) {
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 64;
    labelCanvas.height = 64;
    const labelCtx = labelCanvas.getContext('2d')!;
    labelCtx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    labelCtx.font = 'bold 48px Arial';
    labelCtx.textAlign = 'center';
    labelCtx.textBaseline = 'middle';
    labelCtx.fillText(text, 32, 32);

    const texture = new THREE.CanvasTexture(labelCanvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.position.set(...position);
    sprite.scale.set(50, 50, 1);
    scene.add(sprite);
  }

  function updateVector() {
    vectorArrow.clear();

    const origin = new THREE.Vector3(0, 0, 0);
    const end = new THREE.Vector3(x * 100, y, z);
    const direction = end.clone().normalize();
    const length = end.length();

    // Línea del vector
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array([0, 0, 0, ...end.toArray()]), 3)
    );
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x667eea,
      linewidth: 3
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    vectorArrow.add(line);

    // Punta de flecha
    const coneGeometry = new THREE.ConeGeometry(20, 40, 8);
    const coneMaterial = new THREE.MeshPhongMaterial({ color: 0x667eea });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.position.copy(end);
    cone.lookAt(end.clone().add(direction));
    vectorArrow.add(cone);
  }

  $: {
    if (vectorArrow && scene) {
      updateVector();
    }
  }
</script>

<div class="visualization-container">
  <h3>Visualización del Vector</h3>
  {#if !webglAvailable}
    <div class="fallback-notice">
      <p>ℹ️ Se muestra visualización 3D isométrica en Canvas.</p>
    </div>
  {/if}
  <div class="legend">
    <div class="legend-item">
      <span class="axis-color" style="background-color: #ff0000;"></span>
      <span>Eje X</span>
    </div>
    <div class="legend-item">
      <span class="axis-color" style="background-color: #00ff00;"></span>
      <span>Eje Y</span>
    </div>
    <div class="legend-item">
      <span class="axis-color" style="background-color: #0000ff;"></span>
      <span>Eje Z</span>
    </div>
    <div class="legend-item">
      <span class="axis-color" style="background-color: #667eea;"></span>
      <span>Vector F(t)</span>
    </div>
  </div>
  <div class="canvas-container" bind:this={container}></div>
</div>

<style>
  .visualization-container {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    animation: slideIn 0.6s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  h3 {
    margin: 0 0 1rem 0;
    color: #667eea;
    text-align: center;
  }

  .legend {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1rem;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #555;
  }

  .axis-color {
    width: 16px;
    height: 16px;
    border-radius: 3px;
  }

  .canvas-container {
    width: 100%;
    height: 500px;
    background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
    border-radius: 8px;
    overflow: hidden;
  }

  .fallback-notice {
    background: #fff3cd;
    border: 1px solid #ffc107;
    color: #856404;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .fallback-notice p {
    margin: 0;
  }
</style>
