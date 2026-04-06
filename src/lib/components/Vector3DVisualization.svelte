<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  export let x: number;
  export let y: number;
  export let z: number;

  let container: HTMLDivElement;
  let mouse = { x: 0, y: 0 };
  let isDragging = false;
  let targetRotation = { x: 0.3, y: 0.5 };
  let currentRotation = { x: 0.3, y: 0.5 };
  let zoom = 1;
  let targetZoom = 1;
  let magnitude = 0;
  let angle = 0;

  onMount(() => {
    try {
      // Inicializar escena
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      // Inicializar cámara
      const camera = new THREE.PerspectiveCamera(
        65,
        container.clientWidth / container.clientHeight,
        0.1,
        2000
      );
      camera.position.set(400, 300, 400);

      // Inicializar renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);

      // Agregar luces
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
      directionalLight.position.set(300, 400, 300);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      // Crear grupo principal para rotación
      const rotationGroup = new THREE.Group();
      scene.add(rotationGroup);

      // Dibujar ejes
      const axesGroup = new THREE.Group();
      const axisLength = 300;
      
      // Eje X (Rojo)
      const xGeometry = new THREE.BufferGeometry();
      xGeometry.setAttribute('position', new THREE.BufferAttribute(
        new Float32Array([0, 0, 0, axisLength, 0, 0]),
        3
      ));
      const xMaterial = new THREE.LineBasicMaterial({ color: 0xff3b30, linewidth: 3 });
      const xLine = new THREE.Line(xGeometry, xMaterial);
      axesGroup.add(xLine);

      // Eje Y (Verde)
      const yGeometry = new THREE.BufferGeometry();
      yGeometry.setAttribute('position', new THREE.BufferAttribute(
        new Float32Array([0, 0, 0, 0, axisLength, 0]),
        3
      ));
      const yMaterial = new THREE.LineBasicMaterial({ color: 0x34c759, linewidth: 3 });
      const yLine = new THREE.Line(yGeometry, yMaterial);
      axesGroup.add(yLine);

      // Eje Z (Azul)
      const zGeometry = new THREE.BufferGeometry();
      zGeometry.setAttribute('position', new THREE.BufferAttribute(
        new Float32Array([0, 0, 0, 0, 0, axisLength]),
        3
      ));
      const zMaterial = new THREE.LineBasicMaterial({ color: 0x007aff, linewidth: 3 });
      const zLine = new THREE.Line(zGeometry, zMaterial);
      axesGroup.add(zLine);

      // Etiquetas de ejes
      const createAxisLabel = (text: string, position: [number, number, number], color: string) => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d')!;
        
        ctx.font = 'bold 96px Arial';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(...position);
        sprite.scale.set(40, 40, 1);
        return sprite;
      };

      axesGroup.add(createAxisLabel('X', [350, 0, 0], '#ff3b30'));
      axesGroup.add(createAxisLabel('Y', [0, 350, 0], '#34c759'));
      axesGroup.add(createAxisLabel('Z', [0, 0, 350], '#007aff'));

      rotationGroup.add(axesGroup);

      // Crear paralelepípedo (caja) para visualizar el espacio 3D
      const boxSize = 300;
      const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
      const edges = new THREE.EdgesGeometry(boxGeometry);
      const boxMaterial = new THREE.LineBasicMaterial({ color: 0xcccccc, linewidth: 2 });
      const wireframe = new THREE.LineSegments(edges, boxMaterial);
      rotationGroup.add(wireframe);

      // Agregar caras semitransparentes del paralelepípedo para mejor visualización
      const faceGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
      const faceMaterials = [
        new THREE.MeshStandardMaterial({ color: 0xff6b6b, opacity: 0.06, transparent: true, side: THREE.DoubleSide }),
        new THREE.MeshStandardMaterial({ color: 0xff6b6b, opacity: 0.06, transparent: true, side: THREE.DoubleSide }),
        new THREE.MeshStandardMaterial({ color: 0x51cf66, opacity: 0.06, transparent: true, side: THREE.DoubleSide }),
        new THREE.MeshStandardMaterial({ color: 0x51cf66, opacity: 0.06, transparent: true, side: THREE.DoubleSide }),
        new THREE.MeshStandardMaterial({ color: 0x4dabf7, opacity: 0.06, transparent: true, side: THREE.DoubleSide }),
        new THREE.MeshStandardMaterial({ color: 0x4dabf7, opacity: 0.06, transparent: true, side: THREE.DoubleSide })
      ];
      const boxFaces = new THREE.Mesh(faceGeometry, faceMaterials);
      rotationGroup.add(boxFaces);

      // Calcular magnitud y ángulo
      magnitude = Math.sqrt(x * x + y * y + z * z);
      const safeY = Math.max(Math.abs(y), 0.0001);
      angle = Math.acos(safeY / Math.max(magnitude, 1)) * (180 / Math.PI);

      // Normalizar vector para visualización
      const scale = 150 / Math.max(magnitude, 1);
      const vectorX = x * scale;
      const vectorY = y * scale;
      const vectorZ = z * scale;

      // Crear vector como flecha
      const vectorGroup = new THREE.Group();
      
      // Línea del vector (más gruesa)
      const vectorGeometry = new THREE.BufferGeometry();
      vectorGeometry.setAttribute('position', new THREE.BufferAttribute(
        new Float32Array([0, 0, 0, vectorX, vectorY, vectorZ]),
        3
      ));
      const vectorMaterial = new THREE.LineBasicMaterial({ color: 0x2196f3, linewidth: 5 });
      const vectorLine = new THREE.Line(vectorGeometry, vectorMaterial);
      vectorGroup.add(vectorLine);

      // Punta de flecha (cono mayor)
      const arrowGeometry = new THREE.ConeGeometry(10, 30, 8);
      const arrowMaterial = new THREE.MeshStandardMaterial({ color: 0x2196f3, metalness: 0.5, roughness: 0.3 });
      const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
      arrow.position.set(vectorX, vectorY, vectorZ);
      
      // Rotar flecha para que apunte en la dirección del vector
      const direction = new THREE.Vector3(vectorX, vectorY, vectorZ).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const rotAxis = new THREE.Vector3().crossVectors(up, direction).normalize();
      const rotAngle = Math.acos(Math.max(-1, Math.min(1, up.dot(direction))));
      if (rotAxis.length() > 0.001) {
        arrow.setRotationFromAxisAngle(rotAxis, rotAngle);
      }
      vectorGroup.add(arrow);

      // Punto en el origen (esfera negra)
      const originGeometry = new THREE.SphereGeometry(8, 16, 16);
      const originMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
      const origin = new THREE.Mesh(originGeometry, originMaterial);
      vectorGroup.add(origin);

      // Proyecciones del vector en los planos (líneas punteadas)
      // Proyección en plano XY
      const projXYGeometry = new THREE.BufferGeometry();
      projXYGeometry.setAttribute('position', new THREE.BufferAttribute(
        new Float32Array([0, 0, 0, vectorX, vectorY, 0]),
        3
      ));
      const projMaterial = new THREE.LineBasicMaterial({ color: 0xff9999, linewidth: 1 });
      const projXY = new THREE.Line(projXYGeometry, projMaterial);
      vectorGroup.add(projXY);

      // Proyección en plano XZ
      const projXZGeometry = new THREE.BufferGeometry();
      projXZGeometry.setAttribute('position', new THREE.BufferAttribute(
        new Float32Array([0, 0, 0, vectorX, 0, vectorZ]),
        3
      ));
      const projXZ = new THREE.Line(projXZGeometry, projMaterial);
      vectorGroup.add(projXZ);

      // Proyección en plano YZ
      const projYZGeometry = new THREE.BufferGeometry();
      projYZGeometry.setAttribute('position', new THREE.BufferAttribute(
        new Float32Array([0, 0, 0, 0, vectorY, vectorZ]),
        3
      ));
      const projYZ = new THREE.Line(projYZGeometry, projMaterial);
      vectorGroup.add(projYZ);

      // Líneas desde la punta del vector hasta las proyecciones para mostrar componentes
      const linesMaterial = new THREE.LineBasicMaterial({ color: 0xdddddd, linewidth: 1 });

      // Línea desde punta hasta proyección XY
      const lineToXYGeometry = new THREE.BufferGeometry();
      lineToXYGeometry.setAttribute('position', new THREE.BufferAttribute(
        new Float32Array([vectorX, vectorY, vectorZ, vectorX, vectorY, 0]),
        3
      ));
      const lineToXY = new THREE.Line(lineToXYGeometry, linesMaterial);
      vectorGroup.add(lineToXY);

      rotationGroup.add(vectorGroup);

      // Variables para controles
      let animationId: number;

      // Event listeners para ratón
      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      };

      const onMouseMove = (e: MouseEvent) => {
        if (isDragging) {
          const deltaX = e.clientX - mouse.x;
          const deltaY = e.clientY - mouse.y;

          targetRotation.y += deltaX * 0.005;
          targetRotation.x += deltaY * 0.005;

          mouse.x = e.clientX;
          mouse.y = e.clientY;
        }
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      const onMouseWheel = (e: WheelEvent) => {
        e.preventDefault();
        targetZoom += (e.deltaY > 0 ? -0.1 : 0.1);
        targetZoom = Math.max(0.3, Math.min(3, targetZoom));
      };

      // Touch controls para móviles/tablets
      let touchStartX = 0;
      let touchStartY = 0;
      let touchDistance = 0;

      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          isDragging = true;
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
          // Touch zoom con dos dedos
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          touchDistance = Math.sqrt(dx * dx + dy * dy);
        }
      };

      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 1 && isDragging) {
          const deltaX = e.touches[0].clientX - touchStartX;
          const deltaY = e.touches[0].clientY - touchStartY;

          // Aumentar sensibilidad del toque (2x más que con ratón)
          targetRotation.y += deltaX * 0.01;
          targetRotation.x += deltaY * 0.01;

          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
          // Zoom con dos dedos (pinch)
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          const currentDistance = Math.sqrt(dx * dx + dy * dy);
          const distanceDelta = currentDistance - touchDistance;
          
          // Aumentar sensibilidad del zoom tactil
          targetZoom += (distanceDelta > 0 ? 0.15 : -0.15);
          targetZoom = Math.max(0.3, Math.min(3, targetZoom));
          touchDistance = currentDistance;
        }
      };

      const onTouchEnd = () => {
        isDragging = false;
      };

      renderer.domElement.addEventListener('mousedown', onMouseDown);
      renderer.domElement.addEventListener('mousemove', onMouseMove);
      renderer.domElement.addEventListener('mouseup', onMouseUp);
      renderer.domElement.addEventListener('wheel', onMouseWheel, { passive: false });
      renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: true });
      renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: true });
      renderer.domElement.addEventListener('touchend', onTouchEnd, { passive: true });

      // Loop de animación
      function animate() {
        animationId = requestAnimationFrame(animate);

        // Suavizar rotación
        currentRotation.x += (targetRotation.x - currentRotation.x) * 0.1;
        currentRotation.y += (targetRotation.y - currentRotation.y) * 0.1;

        // Suavizar zoom
        zoom += (targetZoom - zoom) * 0.1;

        rotationGroup.rotation.x = currentRotation.x;
        rotationGroup.rotation.y = currentRotation.y;

        camera.position.setLength(500 / zoom);
        camera.lookAt(0, 0, 0);

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
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.domElement.removeEventListener('mouseup', onMouseUp);
        renderer.domElement.removeEventListener('wheel', onMouseWheel);
        cancelAnimationFrame(animationId);
        renderer.dispose();
        if (container && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    } catch (error) {
      console.error('Error initializing Three.js:', error);
    }
  });
</script>

<div bind:this={container} class="visualization-container">
  <div class="info-panel">
    <div class="info-header">Datos del Vector</div>
    <div class="info-item">
      <span class="label">F(t):</span>
      <span class="value">({x.toFixed(3)}, {y.toFixed(3)}, {z.toFixed(3)})</span>
    </div>
    <div class="info-item">
      <span class="label">Magnitud:</span>
      <span class="value">{magnitude.toFixed(3)} u</span>
    </div>
    <div class="info-item">
      <span class="label">Ángulo:</span>
      <span class="value">{angle.toFixed(2)}°</span>
    </div>
  </div>
  <div class="help-text">
    <strong>Controles:</strong> Arrastra para rotar • Rueda para zoom • Toque para rotar • Pellizco para zoom
  </div>
</div>

<style>
  .visualization-container {
    width: 100%;
    height: 100%;
    min-height: 400px;
    background: white;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
  }

  .info-panel {
    position: absolute;
    top: 12px;
    left: 12px;
    background: rgba(255, 255, 255, 0.98);
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid #d0d0d0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    font-size: 0.8rem;
    z-index: 10;
    backdrop-filter: blur(6px);
    min-width: 220px;
  }

  .info-header {
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 6px;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .info-item {
    display: flex;
    gap: 8px;
    margin-bottom: 5px;
    align-items: baseline;
  }

  .info-item:last-child {
    margin-bottom: 0;
  }

  .label {
    font-weight: 600;
    color: #333;
    min-width: 70px;
    font-size: 0.75rem;
  }

  .value {
    color: #2196f3;
    font-weight: 600;
    font-family: 'Courier New', 'Courier', monospace;
    font-size: 0.8rem;
    letter-spacing: 0.2px;
  }

  .help-text {
    position: absolute;
    bottom: 10px;
    right: 12px;
    font-size: 0.7rem;
    color: #666;
    pointer-events: none;
    background: rgba(255, 255, 255, 0.9);
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
  }
</style>
