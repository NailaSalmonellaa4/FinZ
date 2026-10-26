import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '../utils/sound';

export default function Cute3DCharacter({ 
  mascot = 'cat', // 'cat' | 'panda' | 'shiba'
  equippedOutfit = {}, 
  size = 320, 
  interactive = true 
}) {
  const mountRef = useRef(null);
  const [speechBubble, setSpeechBubble] = useState("Hai! Klik aku buat interaksi gemas! ✨");
  const [isHappy, setIsHappy] = useState(false);

  const tips = [
    "Nabung Rp 5.000 sehari = Rp 1.800.000 setahun lho! 🪙",
    "Beli kebutuhan dulu, baru keinginan belakangan ya! 🎯",
    "Kerjakan kuis melek finansial buat kumpulin koin baju baru! 👕",
    "Streak kamu hebat banget! Pertahankan terus besok ya! 🔥",
    "Dana darurat itu penyelamat kalau HP rusak mendadak! 🛡️",
    "Karaktermu makin keren dengan outfit baru! 😎✨"
  ];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    const width = container.clientWidth || size;
    const height = container.clientHeight || size;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0.8, 4.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff8e7, 1.8);
    dirLight.position.set(4, 7, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0xa3e635, 1.2);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xa855f7, 0.8, 10);
    fillLight.position.set(0, -1, 3);
    scene.add(fillLight);

    // --- Materials based on Mascot ---
    let primaryColor = 0xffffff;   // Cat: White
    let earColor = 0xfbcfe8;       // Pink inner
    let accentColor = 0xf87171;    // Blush: Coral pink
    let eyeColor = 0x1e293b;

    if (mascot === 'panda') {
      primaryColor = 0xffffff;
      earColor = 0x1e293b;
    } else if (mascot === 'shiba') {
      primaryColor = 0xf59e0b;     // Golden brown fur
      earColor = 0xfef08a;
    }

    const furMat = new THREE.MeshStandardMaterial({
      color: primaryColor,
      roughness: 0.45,
      metalness: 0.05
    });

    const innerEarMat = new THREE.MeshStandardMaterial({
      color: earColor,
      roughness: 0.5
    });

    const blushMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      roughness: 0.6,
      transparent: true,
      opacity: 0.75
    });

    const eyeMat = new THREE.MeshStandardMaterial({
      color: eyeColor,
      roughness: 0.1,
      metalness: 0.3
    });

    const catchLightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const noseMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      roughness: 0.2
    });

    // --- Character Root Group ---
    const characterGroup = new THREE.Group();
    scene.add(characterGroup);

    // 1. Head
    const headGeo = new THREE.SphereGeometry(0.9, 32, 32);
    headGeo.scale(1.05, 0.95, 1.0);
    const headMesh = new THREE.Mesh(headGeo, furMat);
    headMesh.position.y = 0.55;
    headMesh.castShadow = true;
    characterGroup.add(headMesh);

    // 2. Ears
    const leftEarGroup = new THREE.Group();
    const rightEarGroup = new THREE.Group();

    if (mascot === 'cat' || mascot === 'shiba') {
      // Pointy Triangle/Cone Ears
      const earGeo = new THREE.ConeGeometry(0.32, 0.6, 24);
      earGeo.scale(1, 1, 0.6);
      const outerEarL = new THREE.Mesh(earGeo, furMat);
      outerEarL.castShadow = true;
      const innerEarGeo = new THREE.ConeGeometry(0.22, 0.45, 16);
      innerEarGeo.scale(1, 1, 0.4);
      const innerEarL = new THREE.Mesh(innerEarGeo, innerEarMat);
      innerEarL.position.z = 0.06;

      leftEarGroup.add(outerEarL);
      leftEarGroup.add(innerEarL);
      leftEarGroup.position.set(-0.58, 1.35, 0.05);
      leftEarGroup.rotation.set(-0.1, 0.1, 0.4);

      const outerEarR = outerEarL.clone();
      const innerEarR = innerEarL.clone();
      rightEarGroup.add(outerEarR);
      rightEarGroup.add(innerEarR);
      rightEarGroup.position.set(0.58, 1.35, 0.05);
      rightEarGroup.rotation.set(-0.1, -0.1, -0.4);
    } else {
      // Panda Round Ears
      const pandaEarGeo = new THREE.SphereGeometry(0.28, 20, 20);
      const earL = new THREE.Mesh(pandaEarGeo, innerEarMat);
      leftEarGroup.add(earL);
      leftEarGroup.position.set(-0.65, 1.25, 0.05);

      const earR = new THREE.Mesh(pandaEarGeo, innerEarMat);
      rightEarGroup.add(earR);
      rightEarGroup.position.set(0.65, 1.25, 0.05);
    }

    headMesh.add(leftEarGroup);
    headMesh.add(rightEarGroup);

    // 3. Eyes & Catchlights
    const eyeGeo = new THREE.SphereGeometry(0.12, 20, 20);
    eyeGeo.scale(1, 1.1, 0.6);

    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.35, 0.58, 0.85);

    const catchLightGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const catchLightL = new THREE.Mesh(catchLightGeo, catchLightMat);
    catchLightL.position.set(-0.32, 0.62, 0.91);

    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.35, 0.58, 0.85);

    const catchLightR = new THREE.Mesh(catchLightGeo, catchLightMat);
    catchLightR.position.set(0.38, 0.62, 0.91);

    headMesh.add(eyeL);
    headMesh.add(catchLightL);
    headMesh.add(eyeR);
    headMesh.add(catchLightR);

    // Panda Eye Patches
    if (mascot === 'panda') {
      const patchGeo = new THREE.SphereGeometry(0.24, 20, 20);
      patchGeo.scale(1.2, 0.9, 0.3);
      const patchL = new THREE.Mesh(patchGeo, innerEarMat);
      patchL.position.set(-0.35, 0.58, 0.78);
      patchL.rotation.z = 0.2;
      headMesh.add(patchL);

      const patchR = new THREE.Mesh(patchGeo, innerEarMat);
      patchR.position.set(0.35, 0.58, 0.78);
      patchR.rotation.z = -0.2;
      headMesh.add(patchR);
    }

    // 4. Blushing Cheeks
    const blushGeo = new THREE.SphereGeometry(0.14, 16, 16);
    blushGeo.scale(1.2, 0.6, 0.3);
    const blushL = new THREE.Mesh(blushGeo, blushMat);
    blushL.position.set(-0.52, 0.44, 0.78);
    const blushR = new THREE.Mesh(blushGeo, blushMat);
    blushR.position.set(0.52, 0.44, 0.78);
    headMesh.add(blushL);
    headMesh.add(blushR);

    // 5. Cute Nose & Mouth
    const noseGeo = new THREE.SphereGeometry(0.07, 16, 16);
    noseGeo.scale(1.2, 0.8, 0.6);
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, 0.46, 0.94);
    headMesh.add(nose);

    // 6. Body
    const bodyGeo = new THREE.SphereGeometry(0.72, 32, 32);
    bodyGeo.scale(1.0, 1.05, 0.95);
    const bodyMesh = new THREE.Mesh(bodyGeo, furMat);
    bodyMesh.position.y = -0.45;
    bodyMesh.castShadow = true;
    characterGroup.add(bodyMesh);

    // 7. Paws (Hands & Feet)
    const pawGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const handL = new THREE.Mesh(pawGeo, furMat);
    handL.position.set(-0.55, -0.35, 0.5);
    const handR = new THREE.Mesh(pawGeo, furMat);
    handR.position.set(0.55, -0.35, 0.5);
    bodyMesh.add(handL);
    bodyMesh.add(handR);

    const footGeo = new THREE.SphereGeometry(0.22, 16, 16);
    footGeo.scale(1, 0.6, 1.3);
    const footL = new THREE.Mesh(footGeo, innerEarMat);
    footL.position.set(-0.38, -0.95, 0.25);
    const footR = new THREE.Mesh(footGeo, innerEarMat);
    footR.position.set(0.38, -0.95, 0.25);
    characterGroup.add(footL);
    characterGroup.add(footR);

    // 8. Wiggling Tail
    const tailGroup = new THREE.Group();
    const tailGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.65, 16);
    const tailMesh = new THREE.Mesh(tailGeo, furMat);
    tailMesh.position.y = 0.3;
    tailMesh.rotation.x = 0.6;
    tailGroup.add(tailMesh);
    tailGroup.position.set(0, -0.5, -0.7);
    characterGroup.add(tailGroup);

    // ==========================================
    // 9. DYNAMIC WARDROBE & ACCESSORIES
    // ==========================================
    const outfitGroup = new THREE.Group();
    characterGroup.add(outfitGroup);

    // --- A. Hat / Headgear ---
    const hatId = equippedOutfit.hat;
    if (hatId === 'hat-grad') {
      // Graduation Mortarboard
      const capBoardGeo = new THREE.BoxGeometry(1.2, 0.08, 1.2);
      const capSkullGeo = new THREE.CylinderGeometry(0.55, 0.58, 0.35, 24);
      const capMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.3 });
      const goldTasselMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.7 });

      const skull = new THREE.Mesh(capSkullGeo, capMat);
      skull.position.set(0, 1.3, 0);
      const board = new THREE.Mesh(capBoardGeo, capMat);
      board.position.set(0, 1.48, 0);
      board.rotation.y = Math.PI / 4;

      const tasselString = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45, 8), goldTasselMat);
      tasselString.position.set(0.5, 1.25, 0.3);
      tasselString.rotation.z = -0.3;

      headMesh.add(skull);
      headMesh.add(board);
      headMesh.add(tasselString);
    } else if (hatId === 'hat-crown') {
      // Golden Crown with Jewels
      const crownBaseGeo = new THREE.CylinderGeometry(0.48, 0.52, 0.3, 24, 1, true);
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.2, metalness: 0.85 });
      const crown = new THREE.Mesh(crownBaseGeo, goldMat);
      crown.position.set(0, 1.45, 0);

      // Crown spikes
      for (let i = 0; i < 5; i++) {
        const spikeGeo = new THREE.ConeGeometry(0.12, 0.28, 12);
        const spike = new THREE.Mesh(spikeGeo, goldMat);
        const angle = (i / 5) * Math.PI * 2;
        spike.position.set(Math.cos(angle) * 0.48, 0.24, Math.sin(angle) * 0.48);
        crown.add(spike);

        // Gem on top
        const gemGeo = new THREE.SphereGeometry(0.05, 12, 12);
        const gemMat = new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0xef4444 : 0x10b981, roughness: 0.1 });
        const gem = new THREE.Mesh(gemGeo, gemMat);
        gem.position.set(0, 0.15, 0);
        spike.add(gem);
      }
      headMesh.add(crown);
    } else if (hatId === 'hat-headset') {
      // Cyber Neon Headphone
      const bandGeo = new THREE.TorusGeometry(0.85, 0.08, 16, 32, Math.PI);
      const headsetMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
      const neonGlowMat = new THREE.MeshStandardMaterial({ color: 0xa3e635, emissive: 0xa3e635, emissiveIntensity: 0.8 });

      const band = new THREE.Mesh(bandGeo, headsetMat);
      band.position.set(0, 0.55, 0);
      band.rotation.x = Math.PI;

      const cupGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.2, 24);
      cupGeo.rotateZ(Math.PI / 2);

      const cupL = new THREE.Mesh(cupGeo, headsetMat);
      cupL.position.set(-0.92, 0.55, 0);
      const glowL = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.22, 16), neonGlowMat);
      glowL.rotation.z = Math.PI / 2;
      cupL.add(glowL);

      const cupR = new THREE.Mesh(cupGeo, headsetMat);
      cupR.position.set(0.92, 0.55, 0);
      const glowR = glowL.clone();
      cupR.add(glowR);

      headMesh.add(band);
      headMesh.add(cupL);
      headMesh.add(cupR);
    } else if (hatId === 'hat-flower') {
      // Sakura Kawaii Flower
      const flowerGroup = new THREE.Group();
      const petalMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.3 });
      const centerMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.2 });

      for (let i = 0; i < 5; i++) {
        const petalGeo = new THREE.SphereGeometry(0.1, 16, 16);
        petalGeo.scale(1.2, 0.6, 0.4);
        const petal = new THREE.Mesh(petalGeo, petalMat);
        const angle = (i / 5) * Math.PI * 2;
        petal.position.set(Math.cos(angle) * 0.12, Math.sin(angle) * 0.12, 0);
        petal.rotation.z = angle;
        flowerGroup.add(petal);
      }
      const center = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), centerMat);
      flowerGroup.add(center);
      flowerGroup.position.set(0.55, 1.15, 0.45);
      flowerGroup.rotation.set(-0.3, 0.4, -0.4);
      headMesh.add(flowerGroup);
    }

    // --- B. Clothes / Outfit ---
    const clothesId = equippedOutfit.clothes;
    let clothesColor = 0x84cc16; // default lime hoodie
    if (clothesId === 'clothes-suit') clothesColor = 0x2563eb;
    if (clothesId === 'clothes-cape') clothesColor = 0xf59e0b;
    if (clothesId === 'clothes-tee') clothesColor = 0xec4899;

    if (clothesId) {
      // Outfit Vest/Shirt wrapping body
      const clothesGeo = new THREE.SphereGeometry(0.74, 32, 24, 0, Math.PI * 2, 0.3, Math.PI * 0.65);
      clothesGeo.scale(1.02, 1.04, 0.98);
      const clothesMat = new THREE.MeshStandardMaterial({
        color: clothesColor,
        roughness: 0.5,
        metalness: 0.1
      });
      const clothesMesh = new THREE.Mesh(clothesGeo, clothesMat);
      clothesMesh.position.y = -0.45;
      clothesMesh.castShadow = true;
      characterGroup.add(clothesMesh);

      // Cute Collar / Tie / Details
      if (clothesId === 'clothes-suit') {
        const tieGeo = new THREE.ConeGeometry(0.12, 0.35, 12);
        const tieMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
        const tie = new THREE.Mesh(tieGeo, tieMat);
        tie.position.set(0, -0.22, 0.65);
        tie.rotation.x = 0.2;
        characterGroup.add(tie);
      } else if (clothesId === 'clothes-hoodie') {
        const stringGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8);
        const stringMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const strL = new THREE.Mesh(stringGeo, stringMat);
        strL.position.set(-0.15, -0.32, 0.62);
        strL.rotation.z = -0.15;
        const strR = new THREE.Mesh(stringGeo, stringMat);
        strR.position.set(0.15, -0.32, 0.62);
        strR.rotation.z = 0.15;
        characterGroup.add(strL);
        characterGroup.add(strR);
      }
    }

    // --- C. Accessories (Floating items) ---
    const accId = equippedOutfit.accessory;
    const accessoryGroup = new THREE.Group();
    characterGroup.add(accessoryGroup);

    if (accId === 'acc-coin') {
      // Floating Gold Coin
      const coinGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 32);
      coinGeo.rotateX(Math.PI / 2);
      const coinMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.3
      });
      const coin = new THREE.Mesh(coinGeo, coinMat);
      accessoryGroup.add(coin);
      accessoryGroup.position.set(1.1, 0.2, 0.4);
    } else if (accId === 'acc-shield') {
      // Holographic Energy Shield
      const shieldGeo = new THREE.CylinderGeometry(0.42, 0.38, 0.08, 6);
      shieldGeo.rotateX(Math.PI / 2);
      const shieldMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.8
      });
      const shield = new THREE.Mesh(shieldGeo, shieldMat);
      accessoryGroup.add(shield);
      accessoryGroup.position.set(-1.1, 0.1, 0.4);
    } else if (accId === 'acc-coffee') {
      // Iced Matcha Cup
      const cupGeo = new THREE.CylinderGeometry(0.18, 0.14, 0.45, 16);
      const matchaMat = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.3 });
      const cup = new THREE.Mesh(cupGeo, matchaMat);

      const lidGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.08, 16);
      const lidMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const lid = new THREE.Mesh(lidGeo, lidMat);
      lid.position.y = 0.24;
      cup.add(lid);

      const strawGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8);
      const strawMat = new THREE.MeshStandardMaterial({ color: 0xec4899 });
      const straw = new THREE.Mesh(strawGeo, strawMat);
      straw.position.set(0.05, 0.32, 0);
      straw.rotation.z = -0.2;
      cup.add(straw);

      accessoryGroup.add(cup);
      accessoryGroup.position.set(1.05, -0.1, 0.4);
    }

    // --- Interactive Mouse Follower ---
    let mouseX = 0;
    let mouseY = 0;
    let targetHeadRotY = 0;
    let targetHeadRotX = 0;

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetHeadRotY = x * 0.4;
      targetHeadRotX = -y * 0.25;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // --- Animation Loop ---
    let animationFrameId;
    let clock = new THREE.Clock();
    let jumpTime = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth idle breathing
      characterGroup.position.y = Math.sin(elapsed * 2.5) * 0.06;
      headMesh.rotation.z = Math.sin(elapsed * 1.5) * 0.03;

      // Soft head tracking
      headMesh.rotation.y += (targetHeadRotY - headMesh.rotation.y) * 0.1;
      headMesh.rotation.x += (targetHeadRotX - headMesh.rotation.x) * 0.1;

      // Ears wiggle
      leftEarGroup.rotation.z = 0.4 + Math.sin(elapsed * 4) * 0.04;
      rightEarGroup.rotation.z = -0.4 - Math.sin(elapsed * 4) * 0.04;

      // Tail waggle
      tailGroup.rotation.z = Math.sin(elapsed * 5) * 0.3;

      // Accessory animation
      if (accId === 'acc-coin') {
        accessoryGroup.rotation.y = elapsed * 2.5;
        accessoryGroup.position.y = 0.2 + Math.sin(elapsed * 3) * 0.08;
      } else if (accId) {
        accessoryGroup.position.y = 0.1 + Math.sin(elapsed * 2) * 0.06;
      }

      // Jump reaction on click
      if (jumpTime > 0) {
        jumpTime -= 0.05;
        characterGroup.position.y += Math.sin(jumpTime * Math.PI) * 0.35;
        characterGroup.rotation.y = Math.sin(jumpTime * Math.PI * 2) * 0.4;
      } else {
        characterGroup.rotation.y = 0;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Trigger Jump helper
    container.triggerPetJump = () => {
      jumpTime = 1.0;
    };

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [mascot, equippedOutfit, size, interactive]);

  // Handle Mascot Pet Click
  const handlePetClick = () => {
    sounds.playCoin();
    setIsHappy(true);
    if (mountRef.current && mountRef.current.triggerPetJump) {
      mountRef.current.triggerPetJump();
    }
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setSpeechBubble(randomTip);
    setTimeout(() => setIsHappy(false), 1200);
  };

  return (
    <div className="flex flex-col items-center select-none relative group">
      
      {/* Speech Thought Bubble */}
      <div className={`transition-all duration-300 max-w-[260px] text-center px-4 py-2.5 rounded-2xl border text-xs font-bold shadow-xl mb-1 relative ${
        isHappy 
          ? 'bg-lime-400 text-black border-lime-300 scale-105 shadow-lime-400/30' 
          : 'bg-slate-900/90 text-slate-200 border-white/10 shadow-black/40'
      }`}>
        <p className="leading-snug">{speechBubble}</p>
        <div className={`w-2.5 h-2.5 rotate-45 mx-auto -bottom-1 absolute left-1/2 -translate-x-1/2 border-r border-b ${
          isHappy ? 'bg-lime-400 border-lime-300' : 'bg-slate-900 border-white/10'
        }`} />
      </div>

      {/* 3D Canvas Mount */}
      <div 
        ref={mountRef}
        onClick={handlePetClick}
        title="Klik maskot untuk dielus & dengar tips keuangan!"
        className="cursor-pointer transition-transform duration-200 active:scale-95"
        style={{ width: size, height: size }}
      />

      <span className="text-[10px] text-slate-400 -mt-2 font-medium">
        🐾 Klik maskot untuk dielus & dapatkan tips
      </span>
    </div>
  );
}
