import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";
import { Text } from "troika-three-text";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
const InteractiveMentalHealthSpace = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const characterRef = useRef(null);
  const worldRef = useRef(null);
  const animationRef = useRef(null);
  const keysRef = useRef({});
  const [nearPortal, setNearPortal] = useState(null);
  const activePortalRef = useRef(null);
  const [showPortalPrompt, setShowPortalPrompt] = useState(false);
  const [portalMessage, setPortalMessage] = useState("");
  const [score, setScore] = useState(0);
  const [isMeditating, setIsMeditating] = useState(false);
  const [meditationTime, setMeditationTime] = useState(0);
  const [wellnessScore, setWellnessScore] = useState(0);

  // Enhanced constants for better game feel
  const INTERACTION_DISTANCE = 5;
  const MOVE_SPEED = 50; // Reduced from 100 to 50
  const MAX_VELOCITY = 7.5; // Reduced from 15 to 7.5
  const JUMP_FORCE = 8; // Reduced from 10 to 8
  const CHARACTER_SCALE = 1;
  const GRAVITY = -20;
  const LINEAR_DAMPING = 0.7; // Increased from 0.6 for smoother deceleration
  const GROUND_FRICTION = 0.8;

  const COLOR_PALETTE = {
    primary: 0x6a98f0, // Calming blue
    secondary: 0xffb5d8, // Soft pink
    accent: 0x9ef0c7, // Mint green
    ground: 0xe6eef9, // Light blue-grey
    ambient: 0xf5e6ff, // Soft purple
  };
  
  const createNPC = (npcData) => {
    const npc = new THREE.Group();
    npc.position.copy(npcData.position);
    npc.userData = npcData;

    // Adjusted scale - make character slightly shorter but keep proportions
    const HEAD_SIZE = 0.25; // Slightly smaller head
    const TOTAL_HEIGHT = HEAD_SIZE * 6.5; // Shorter overall height

    // Enhanced materials
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: npcData.skinColor || 0xffe0bd,
      metalness: 0.2,
      roughness: 0.8,
    });

    const clothingMaterial = new THREE.MeshStandardMaterial({
      color: npcData.clothingColor || 0x2c3e50,
      metalness: 0.1,
      roughness: 0.9,
    });

    // Torso with better proportions
    const torsoGeometry = new THREE.CapsuleGeometry(
      HEAD_SIZE * 1.4,
      HEAD_SIZE * 2.2,
      12,
      24
    );
    const torso = new THREE.Mesh(torsoGeometry, clothingMaterial);
    torso.position.y = TOTAL_HEIGHT * 0.5;
    npc.add(torso);

    // Enhanced face creation
    const createDetailedFace = () => {
      const faceGroup = new THREE.Group();

      // Main head - slightly wider than before
      const headGeometry = new THREE.SphereGeometry(HEAD_SIZE, 32, 32);
      const head = new THREE.Mesh(headGeometry, skinMaterial);
      head.scale.x = 1.1; // Slightly wider
      head.scale.z = 0.9; // Slightly less deep
      faceGroup.add(head);

      // Improved eye creation
      const createEye = (side) => {
        const eyeGroup = new THREE.Group();
        const eyeSize = HEAD_SIZE * 0.15;

        // Eye socket - deeper and more defined
        const socketGeometry = new THREE.SphereGeometry(
          eyeSize * 1.3,
          16,
          16,
          0,
          Math.PI,
          0,
          Math.PI
        );
        const socket = new THREE.Mesh(socketGeometry, skinMaterial);
        socket.rotation.x = Math.PI / 2;
        eyeGroup.add(socket);

        // Eyeball with more detail
        const eyeballGeometry = new THREE.SphereGeometry(eyeSize, 24, 24);
        const eyeballMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          metalness: 0.1,
          roughness: 0.2,
        });
        const eyeball = new THREE.Mesh(eyeballGeometry, eyeballMaterial);
        eyeGroup.add(eyeball);

        // Detailed iris
        const irisGeometry = new THREE.CircleGeometry(eyeSize * 0.6, 32);
        const irisMaterial = new THREE.MeshStandardMaterial({
          color: npcData.eyeColor || 0x4b2c20,
          metalness: 0.4,
          roughness: 0.3,
        });
        const iris = new THREE.Mesh(irisGeometry, irisMaterial);
        iris.position.z = eyeSize * 0.9;
        eyeGroup.add(iris);

        // Pupil
        const pupilGeometry = new THREE.CircleGeometry(eyeSize * 0.3, 32);
        const pupilMaterial = new THREE.MeshStandardMaterial({
          color: 0x000000,
        });
        const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        pupil.position.z = eyeSize * 0.91;
        eyeGroup.add(pupil);

        // Position the eye
        eyeGroup.position.x = side * HEAD_SIZE * 0.35;
        eyeGroup.position.z = HEAD_SIZE * 0.75;
        eyeGroup.position.y = HEAD_SIZE * 0.1;
        eyeGroup.rotation.y = -side * 0.2; // Slight inward angle

        return eyeGroup;
      };

      faceGroup.add(createEye(-1)); // Left eye
      faceGroup.add(createEye(1)); // Right eye

      // Enhanced nose with more detail
      const noseGroup = new THREE.Group();

      // Nose bridge
      const bridgeGeometry = new THREE.CapsuleGeometry(
        HEAD_SIZE * 0.08,
        HEAD_SIZE * 0.6,
        8,
        8
      );
      const bridge = new THREE.Mesh(bridgeGeometry, skinMaterial);
      bridge.rotation.x = Math.PI / 2;
      bridge.position.z = HEAD_SIZE * 0.6;
      noseGroup.add(bridge);

      // Nose tip with better shape
      const tipGeometry = new THREE.SphereGeometry(HEAD_SIZE * 0.1, 8, 8);
      const tip = new THREE.Mesh(tipGeometry, skinMaterial);
      tip.scale.x = 1.2;
      tip.scale.z = 1.1;
      tip.position.z = HEAD_SIZE * 0.85;
      tip.position.y = -HEAD_SIZE * 0.1;
      noseGroup.add(tip);

      // Nostrils
      const nostrilGeometry = new THREE.SphereGeometry(HEAD_SIZE * 0.04, 8, 8);
      const nostrilMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0,
        roughness: 1,
      });

      [-1, 1].forEach((side) => {
        const nostril = new THREE.Mesh(nostrilGeometry, nostrilMaterial);
        nostril.position.set(
          side * HEAD_SIZE * 0.08,
          -HEAD_SIZE * 0.15,
          HEAD_SIZE * 0.82
        );
        noseGroup.add(nostril);
      });

      faceGroup.add(noseGroup);

      // Enhanced mouth with better shape and lips
      const mouthGroup = new THREE.Group();

      // Upper lip
      const upperLipGeometry = new THREE.CapsuleGeometry(
        HEAD_SIZE * 0.25,
        HEAD_SIZE * 0.05,
        8,
        8
      );
      const upperLip = new THREE.Mesh(
        upperLipGeometry,
        new THREE.MeshStandardMaterial({
          color: 0xc68075,
          metalness: 0.2,
          roughness: 0.8,
        })
      );
      upperLip.rotation.x = Math.PI / 2;
      upperLip.position.y = -HEAD_SIZE * 0.25;
      upperLip.position.z = HEAD_SIZE * 0.8;
      mouthGroup.add(upperLip);

      // Lower lip - slightly bigger
      const lowerLipGeometry = new THREE.CapsuleGeometry(
        HEAD_SIZE * 0.28,
        HEAD_SIZE * 0.06,
        8,
        8
      );
      const lowerLip = new THREE.Mesh(lowerLipGeometry, upperLip.material);
      lowerLip.rotation.x = Math.PI / 2;
      lowerLip.position.y = -HEAD_SIZE * 0.32;
      lowerLip.position.z = HEAD_SIZE * 0.78;
      mouthGroup.add(lowerLip);

      faceGroup.add(mouthGroup);

      return faceGroup;
    };

    // Create and position the face
    const face = createDetailedFace();
    face.position.y = TOTAL_HEIGHT * 0.7 + HEAD_SIZE;
    npc.add(face);

    // Neck (slightly shorter)
    const neckGeometry = new THREE.CylinderGeometry(
      HEAD_SIZE * 0.25,
      HEAD_SIZE * 0.3,
      HEAD_SIZE * 0.3,
      16
    );
    const neck = new THREE.Mesh(neckGeometry, skinMaterial);
    neck.position.y = TOTAL_HEIGHT * 0.52;
    npc.add(neck);

    // Rest of the body parts (arms and legs) remain similar but scaled accordingly
    const createLimbs = () => {
      // Arms
      [-1, 1].forEach((side) => {
        const armGroup = new THREE.Group();

        // Upper arm
        const upperArm = new THREE.Mesh(
          new THREE.CapsuleGeometry(HEAD_SIZE * 0.25, HEAD_SIZE * 1.3, 8, 16),
          clothingMaterial
        );
        upperArm.position.y = -HEAD_SIZE * 0.65;
        armGroup.add(upperArm);

        // Lower arm
        const lowerArm = new THREE.Mesh(
          new THREE.CapsuleGeometry(HEAD_SIZE * 0.2, HEAD_SIZE * 1.2, 8, 16),
          skinMaterial
        );
        lowerArm.position.y = -HEAD_SIZE * 2;
        armGroup.add(lowerArm);

        // Hand
        const hand = new THREE.Mesh(
          new THREE.SphereGeometry(HEAD_SIZE * 0.2, 16, 16),
          skinMaterial
        );
        hand.scale.y = 1.2;
        hand.position.y = -HEAD_SIZE * 2.7;
        armGroup.add(hand);

        armGroup.position.set(side * HEAD_SIZE * 1.5, TOTAL_HEIGHT * 0.45, 0);
        npc.add(armGroup);
      });

      // Legs
      [-1, 1].forEach((side) => {
        const legGroup = new THREE.Group();

        // Upper leg
        const upperLeg = new THREE.Mesh(
          new THREE.CapsuleGeometry(HEAD_SIZE * 0.35, HEAD_SIZE * 1.8, 8, 16),
          clothingMaterial
        );
        upperLeg.position.y = -HEAD_SIZE * 1.5;
        legGroup.add(upperLeg);

        // Lower leg
        const lowerLeg = new THREE.Mesh(
          new THREE.CapsuleGeometry(HEAD_SIZE * 0.3, HEAD_SIZE * 1.8, 8, 16),
          clothingMaterial
        );
        lowerLeg.position.y = -HEAD_SIZE * 2.7;
        legGroup.add(lowerLeg);

        // Foot
        const foot = new THREE.Mesh(
          new THREE.BoxGeometry(
            HEAD_SIZE * 0.35,
            HEAD_SIZE * 0.25,
            HEAD_SIZE * 0.8
          ),
          skinMaterial
        );
        foot.position.set(0, -HEAD_SIZE * 3.7, HEAD_SIZE * 0.2);
        legGroup.add(foot);

        legGroup.position.set(side * HEAD_SIZE * 1.5, TOTAL_HEIGHT * 0.25, 0);
        npc.add(legGroup);
      });
    };

    createLimbs();

    // Name tag
    const createNameTag = () => {
      const textGroup = new THREE.Group();

      // Background for better readability
      const bgGeometry = new THREE.PlaneGeometry(
        HEAD_SIZE * 4,
        HEAD_SIZE * 0.8
      );
      const bgMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.2,
      });
      const background = new THREE.Mesh(bgGeometry, bgMaterial);
      textGroup.add(background);

      const textMesh = new Text();
      textMesh.text = npcData.name;
      textMesh.fontSize = HEAD_SIZE * 0.6;
      textMesh.color = 0xffffff;
      textMesh.anchorX = "center";
      textMesh.anchorY = "middle";
      textMesh.material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
      });
      textMesh.sync();
      textGroup.add(textMesh);

      textGroup.position.y = TOTAL_HEIGHT + HEAD_SIZE * 0.5;
      return textGroup;
    };

    npc.add(createNameTag());

    // Improved natural animation
    let time = 0;
    const animate = () => {
      time += 0.015;

      // Subtle breathing
      torso.position.y = TOTAL_HEIGHT * 0.35 + Math.sin(time * 1.5) * 0.01;

      // Very slight body sway
      npc.rotation.y = Math.sin(time * 0.5) * 0.03;

      // Subtle arm movement
      npc.children.forEach((child) => {
        if (child.isGroup && child.position.x !== 0) {
          child.rotation.z =
            Math.sin(time * 0.7) * 0.03 * Math.sign(child.position.x);
        }
      });

      // Natural head movement
      face.rotation.y = Math.sin(time * 0.8) * 0.02;
      face.rotation.z = Math.sin(time * 0.4) * 0.01;

      // Realistic blinking
      if (Math.sin(time * 3) > 0.995) {
        face.children[1].scale.y = 0.1; // Left eye
        face.children[2].scale.y = 0.1; // Right eye
      } else {
        face.children[1].scale.y = 1;
        face.children[2].scale.y = 1;
      }

      requestAnimationFrame(animate);
    };
    animate();

    return npc;
  };

  const logPortalInteraction = (message) => {
    console.log(`Portal Interaction: ${message}`);
  };

  useEffect(() => {
    // Scene setup with enhanced lighting and atmosphere
    const scene = new THREE.Scene();

    // Enhanced atmosphere
    scene.background = new THREE.Color(COLOR_PALETTE.ambient);
    scene.fog = new THREE.FogExp2(COLOR_PALETTE.ambient, 0.015);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Enhanced lighting for better atmosphere
    const setupLighting = () => {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      // Main directional light with enhanced shadows
      const mainLight = new THREE.DirectionalLight(0xffffff, 1);
      mainLight.position.set(10, 20, 10);
      mainLight.castShadow = true;
      mainLight.shadow.mapSize.width = 4096;
      mainLight.shadow.mapSize.height = 4096;
      mainLight.shadow.camera.far = 50;
      mainLight.shadow.bias = -0.0001;
      scene.add(mainLight);

      // Colored rim lights for atmosphere
      const createRimLight = (color, position) => {
        const light = new THREE.DirectionalLight(color, 0.5);
        light.position.copy(position);
        scene.add(light);
      };

      createRimLight(COLOR_PALETTE.secondary, new THREE.Vector3(-10, 5, -10));
      createRimLight(COLOR_PALETTE.accent, new THREE.Vector3(10, 5, -10));
    };

    const directionalLight = new THREE.DirectionalLight(0xfff5e6, 0.9); // Warmer light
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    // Create Roblox-style character
    const createCharacter = () => {
      const character = new THREE.Group();

      // Enhanced body proportions
      const torsoGeometry = new THREE.BoxGeometry(1, 1.5, 0.8);
      const limbMaterial = new THREE.MeshStandardMaterial({
        color: 0x4fc3f7,
        metalness: 0.1,
        roughness: 0.5,
      });
      const torso = new THREE.Mesh(torsoGeometry, limbMaterial);
      torso.position.y = 1.5;
      character.add(torso);

      // Head with face features
      const headGroup = new THREE.Group();
      const headGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const head = new THREE.Mesh(headGeometry, limbMaterial);
      headGroup.add(head);

      // Eyes
      const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      leftEye.position.set(0.2, 0, 0.4);
      leftEye.scale.set(0.5, 1, 0.1);
      headGroup.add(leftEye);

      const rightEye = leftEye.clone();
      rightEye.position.x = -0.2;
      headGroup.add(rightEye);

      // Smile
      const smileGeometry = new THREE.TorusGeometry(0.2, 0.05, 16, 32, Math.PI);
      const smileMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
      const smile = new THREE.Mesh(smileGeometry, smileMaterial);
      smile.position.set(0, -0.1, 0.4);
      smile.rotation.x = Math.PI;
      headGroup.add(smile);

      headGroup.position.y = 2.8;
      character.add(headGroup);

      // Limbs with joints
      const upperArmGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.3);
      const lowerArmGeometry = new THREE.BoxGeometry(0.25, 0.7, 0.25);
      const upperLegGeometry = new THREE.BoxGeometry(0.35, 0.9, 0.35);
      const lowerLegGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.3);

      // Arms
      const createArm = (isLeft) => {
        const armGroup = new THREE.Group();
        const upperArm = new THREE.Mesh(upperArmGeometry, limbMaterial);
        upperArm.position.y = -0.4;
        const lowerArm = new THREE.Mesh(lowerArmGeometry, limbMaterial);
        lowerArm.position.y = -0.75;
        upperArm.add(lowerArm);
        armGroup.add(upperArm);
        armGroup.position.set(isLeft ? 0.65 : -0.65, 2.3, 0);
        return armGroup;
      };

      const leftArm = createArm(true);
      const rightArm = createArm(false);
      character.add(leftArm, rightArm);

      // Legs
      const createLeg = (isLeft) => {
        const legGroup = new THREE.Group();
        const upperLeg = new THREE.Mesh(upperLegGeometry, limbMaterial);
        upperLeg.position.y = -0.45;
        const lowerLeg = new THREE.Mesh(lowerLegGeometry, limbMaterial);
        lowerLeg.position.y = -0.85;
        upperLeg.add(lowerLeg);
        legGroup.add(upperLeg);
        legGroup.position.set(isLeft ? 0.3 : -0.3, 1.5, 0);
        return legGroup;
      };

      const leftLeg = createLeg(true);
      const rightLeg = createLeg(false);
      character.add(leftLeg, rightLeg);

      character.scale.set(CHARACTER_SCALE, CHARACTER_SCALE, CHARACTER_SCALE);
      character.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      return character;
    };

    const characterMesh = createCharacter();
    scene.add(characterMesh);

    // Enhanced character physics
    const characterShape = new CANNON.Box(new CANNON.Vec3(0.4, 1, 0.4));
    const characterBody = new CANNON.Body({
      mass: 5,
      position: new CANNON.Vec3(0, 3, 0),
      shape: new CANNON.Box(new CANNON.Vec3(0.4, 1, 0.4)),
      material: new CANNON.Material({ friction: GROUND_FRICTION }),
      fixedRotation: true,
      linearDamping: LINEAR_DAMPING,
      allowSleep: false, // Prevent character from "sleeping" during physics simulation
    });

    const characterGroundContact = new CANNON.ContactMaterial(
      characterBody.material,
      new CANNON.Material(),
      {
        friction: GROUND_FRICTION,
        restitution: 0.0, // No bouncing
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3,
      }
    );
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, GRAVITY, 0),
    });
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.defaultContactMaterial.friction = GROUND_FRICTION;
    world.addBody(characterBody);
    worldRef.current = world;

    characterRef.current = {
      mesh: characterMesh,
      body: characterBody,
      isJumping: false,
      canJump: true,
    };

    world.addContactMaterial(characterGroundContact);
    // Improved character animations
    const animateCharacter = (character, velocity) => {
      const walkingSpeed = Math.sqrt(
        velocity.x * velocity.x + velocity.z * velocity.z
      );
      const walkingCycle = Date.now() * 0.005;

      // Roblox-style animations
      if (walkingSpeed > 0.1) {
        // Leg animations
        character.children[4].rotation.x = Math.sin(walkingCycle) * 0.5; // Left leg
        character.children[5].rotation.x =
          Math.sin(walkingCycle + Math.PI) * 0.5; // Right leg

        // Arm animations
        character.children[2].rotation.x =
          Math.sin(walkingCycle + Math.PI) * 0.5; // Left arm
        character.children[3].rotation.x = Math.sin(walkingCycle) * 0.5; // Right arm

        // Torso bounce
        character.children[0].position.y =
          1.5 + Math.abs(Math.sin(walkingCycle * 2)) * 0.1;

        // Head tilt
        character.children[1].rotation.z = Math.sin(walkingCycle) * 0.1;
      } else {
        // Reset to idle pose
        character.children[4].rotation.x = 0;
        character.children[5].rotation.x = 0;
        character.children[2].rotation.x = 0;
        character.children[3].rotation.x = 0;
        character.children[0].position.y = 1.5;
        character.children[1].rotation.z = 0;
      }

      // Jump animation
      if (velocity.y > 0.5) {
        character.children[4].rotation.x = -0.4;
        character.children[5].rotation.x = -0.4;
        character.children[2].rotation.x = -0.8;
        character.children[3].rotation.x = -0.8;
      }
    };

    // Physics world setup

    // Enhanced environment creation
    const createEnvironment = () => {
      const environment = new THREE.Group();

      // Grass floor with texture
      const groundGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
      const groundMaterial = new THREE.MeshStandardMaterial({
        color: COLOR_PALETTE.ground,
        roughness: 0.8,
        metalness: 0.2,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
      });

      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      environment.add(ground);
      const solidGround = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshStandardMaterial({
          color: COLOR_PALETTE.ground,
          roughness: 0.8,
          metalness: 0.2,
        })
      );
      solidGround.rotation.x = -Math.PI / 2;
      solidGround.position.y = -0.1;
      solidGround.receiveShadow = true;
      environment.add(solidGround);
      const floorGeometry = new THREE.PlaneGeometry(100, 100);
      const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x90ee90,
        roughness: 0.8,
        metalness: 0.2,
      });
      const createCrystal = (position) => {
        const crystal = new THREE.Group();
        const geometry = new THREE.OctahedronGeometry(0.5);
        const material = new THREE.MeshStandardMaterial({
          color: COLOR_PALETTE.secondary,
          metalness: 1,
          roughness: 0,
          transparent: true,
          opacity: 0.7,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        crystal.add(mesh);

        // Add glow effect
        const glowGeometry = new THREE.OctahedronGeometry(0.7);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: COLOR_PALETTE.secondary,
          transparent: true,
          opacity: 0.3,
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        crystal.add(glow);

        crystal.position.copy(position);
        return crystal;
      };

      // Add floating crystals around the environment
      const crystalPositions = [
        new THREE.Vector3(5, 2, 5),
        new THREE.Vector3(-5, 3, -5),
        new THREE.Vector3(8, 4, -8),
        new THREE.Vector3(-8, 2.5, 8),
      ];
      crystalPositions.forEach((position) => {
        environment.add(createCrystal(position));
      });
      const createMeditationZone = (position) => {
        const zone = new THREE.Group();

        // Base platform
        const platformGeometry = new THREE.CircleGeometry(2, 32);
        const platformMaterial = new THREE.MeshStandardMaterial({
          color: COLOR_PALETTE.accent,
          metalness: 0.5,
          roughness: 0.2,
          transparent: true,
          opacity: 0.7,
        });

        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.rotation.x = -Math.PI / 2;
        platform.position.copy(position);
        zone.add(platform);

        // Floating orbs
        const orbCount = 8;
        for (let i = 0; i < orbCount; i++) {
          const angle = (i / orbCount) * Math.PI * 2;
          const orbGeometry = new THREE.SphereGeometry(0.1);
          const orbMaterial = new THREE.MeshStandardMaterial({
            color: COLOR_PALETTE.primary,
            emissive: COLOR_PALETTE.primary,
            emissiveIntensity: 0.5,
          });

          const orb = new THREE.Mesh(orbGeometry, orbMaterial);
          orb.position.set(
            position.x + Math.cos(angle) * 1.5,
            position.y + 0.5,
            position.z + Math.sin(angle) * 1.5
          );
          zone.add(orb);
        }

        return zone;
      };

      // Add meditation zones
      const meditationZones = [
        new THREE.Vector3(0, 0, -10),
        new THREE.Vector3(10, 0, 10),
        new THREE.Vector3(-10, 0, 10),
      ];

      meditationZones.forEach((position) => {
        environment.add(createMeditationZone(position));
      });

      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      environment.add(floor);

      // Add decorative elements
      const addDecorations = () => {
        // Trees
        const createTree = (x, z) => {
          const tree = new THREE.Group();

          // Trunk
          const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 2, 8);
          const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
          });
          const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
          trunk.castShadow = true;
          tree.add(trunk);

          // Leaves
          const leavesGeometry = new THREE.ConeGeometry(1.5, 3, 8);
          const leavesMaterial = new THREE.MeshStandardMaterial({
            color: 0x228b22,
          });
          const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
          leaves.position.y = 2.5;
          leaves.castShadow = true;
          tree.add(leaves);

          tree.position.set(x, 1, z);
          return tree;
        };

        // Add trees around the environment
        const treePositions = [
          [-20, -20],
          [20, -20],
          [-20, 20],
          [20, 20],
          [-10, -15],
          [10, -15],
          [-15, 10],
          [15, 10],
        ];

        treePositions.forEach(([x, z]) => {
          environment.add(createTree(x, z));
        });

        // Add rocks
        const createRock = (x, z, scale = 1) => {
          const rockGeometry = new THREE.DodecahedronGeometry(scale, 1);
          const rockMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080,
            roughness: 0.8,
          });
          const rock = new THREE.Mesh(rockGeometry, rockMaterial);
          rock.position.set(x, scale / 2, z);
          rock.rotation.y = Math.random() * Math.PI;
          rock.castShadow = true;
          rock.receiveShadow = true;
          return rock;
        };

        // Add rocks around the environment
        const rockPositions = [
          [-8, -8, 0.5],
          [8, -8, 0.7],
          [-8, 8, 0.6],
          [8, 8, 0.5],
          [-12, -12, 0.8],
          [12, -12, 0.6],
          [-12, 12, 0.7],
          [12, 12, 0.8],
        ];

        rockPositions.forEach(([x, z, scale]) => {
          environment.add(createRock(x, z, scale));
        });
      };

      addDecorations();
      scene.add(environment);

      // Add environment physics
      const groundBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
        material: new CANNON.Material({ friction: 0.5 }),
      });
      groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
      world.addBody(groundBody);
    };

    createEnvironment();

    const createPortal = (portalData) => {
      const portal = new THREE.Group();
      portal.position.copy(portalData.position);
      portal.userData = portalData;

      // Portal ring with complex geometry
      const ringGeometry = new THREE.TorusKnotGeometry(1.2, 0.1, 100, 16);
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: portalData.color,
        metalness: 1,
        roughness: 0,
        emissive: portalData.color,
        emissiveIntensity: 0.5,
      });

      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      portal.add(ring);

      // Portal core with custom shader
      const coreGeometry = new THREE.SphereGeometry(0.8, 32, 32);
      const coreMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(portalData.color) },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 color;
          varying vec2 vUv;
          
          void main() {
            vec2 center = vec2(0.5, 0.5);
            float dist = length(vUv - center);
            float wave = sin(dist * 10.0 - time * 2.0) * 0.5 + 0.5;
            vec3 finalColor = mix(color, vec3(1.0), wave * 0.5);
            gl_FragColor = vec4(finalColor, 0.8);
          }
        `,
        transparent: true,
      });

      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      portal.add(core);

      // Add portal text with enhanced styling
      const textMesh = new Text();
      textMesh.text = portalData.text;
      textMesh.fontSize = 0.25;
      textMesh.position.set(0, 1.8, 0);
      textMesh.color = 0xffffff;
      textMesh.anchorX = "center";
      textMesh.anchorY = "middle";
      textMesh.material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
      });
      textMesh.sync();
      portal.add(textMesh);

      return portal;
    };

    // Enhanced portals with particle effects
    const npcs = [
      {
        position: new THREE.Vector3(10, 0, -10),
        name: "Exercise For Disabled",
        greeting: "Hey there! Ready for some exercise?",
        destination: "http://localhost:5173/exercise",
        color: 0x81c784,
      },
      {
        position: new THREE.Vector3(-10, 0, -10),
        name: "Therapy cards",
        greeting: "Would you like to explore some therapy cards?",
        destination: "http://localhost:5173/therapycards",
        color: 0x64b5f6,
      },
      {
        position: new THREE.Vector3(0, 0, -14),
        name: "Dashboard",
        greeting: "Welcome to the Wellness Hub!",
        destination: "http://localhost:5173/",
        color: 0xffb74d,
      },
      {
        position: new THREE.Vector3(-10, 0, 0),
        name: "Therapist Meet",
        greeting: "Need someone to talk to?",
        destination: "http://localhost:3005/",
        color: 0xba68c8,
      },
      {
        position: new THREE.Vector3(10, 0, 0),
        name: "Aura Assistant",
        greeting: "Hi! I'm here to chat and help!",
        destination: "http://localhost:3001/",
        color: 0x4db6ac,
      },
    ];

    // Enhanced portal creation with particles and glow effects
    const npcMeshes = npcs.map((npcData) => {
      const npcMesh = createNPC(npcData);
      scene.add(npcMesh);
      return npcMesh;
    });

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Bloom effect
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // Bloom strength
      0.4, // Radius
      0.85 // Threshold
    );
    composer.addPass(bloomPass);

    // Anti-aliasing
    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.material.uniforms["resolution"].value.x =
      1 / (window.innerWidth * renderer.getPixelRatio());
    fxaaPass.material.uniforms["resolution"].value.y =
      1 / (window.innerHeight * renderer.getPixelRatio());
    composer.addPass(fxaaPass);

    // Enhanced controls with smooth movement
    const handleKeyDown = (event) => {
      keysRef.current[event.code] = true;

      if (event.code === "Space" && characterRef.current.canJump) {
        characterRef.current.body.velocity.y = JUMP_FORCE;
        characterRef.current.isJumping = true;
        characterRef.current.canJump = false;

        const moveX =
          (keysRef.current["KeyD"] ? 1 : 0) - (keysRef.current["KeyA"] ? 1 : 0);
        const moveZ =
          (keysRef.current["KeyS"] ? 1 : 0) - (keysRef.current["KeyW"] ? 1 : 0);
        if (moveX !== 0 || moveZ !== 0) {
          const angle = Math.atan2(moveX, moveZ);
          characterRef.current.body.velocity.x += Math.sin(angle) * 5;
          characterRef.current.body.velocity.z += Math.cos(angle) * 5;
        }
      }

      if (event.code === "KeyE") {
        if (activePortalRef.current) {
          const npc = activePortalRef.current;
          // Show dialog or transition
          setPortalMessage(npc.userData.greeting);
          setTimeout(() => {
            window.location.href = npc.userData.destination;
          }, 1000);
        }
      }
    };

    const handleKeyUp = (event) => {
      keysRef.current[event.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Animation loop with improved physics and character control
    const animate = () => {
      world.step(1 / 60);

      if (characterRef.current) {
        const { mesh, body } = characterRef.current;

        // Movement with inertia
        const moveX =
          (keysRef.current["KeyD"] ? 1 : 0) - (keysRef.current["KeyA"] ? 1 : 0);
        const moveZ =
          (keysRef.current["KeyS"] ? 1 : 0) - (keysRef.current["KeyW"] ? 1 : 0);

        if (moveX !== 0 || moveZ !== 0) {
          const angle = Math.atan2(moveX, moveZ);
          body.velocity.x += Math.sin(angle) * MOVE_SPEED * 0.5;
          body.velocity.z += Math.cos(angle) * MOVE_SPEED * 0.5;

          // Clamp velocity
          const horizontalVelocity = new THREE.Vector2(
            body.velocity.x,
            body.velocity.z
          );
          if (horizontalVelocity.length() > MAX_VELOCITY) {
            horizontalVelocity.normalize().multiplyScalar(MAX_VELOCITY);
            body.velocity.x = horizontalVelocity.x;
            body.velocity.z = horizontalVelocity.y;
          }

          // Rotate character in movement direction
          mesh.rotation.y = angle;
        } else {
          // Apply friction
          body.velocity.x *= 0.95;
          body.velocity.z *= 0.95;
        }

        // Update character position and animation
        mesh.position.copy(body.position);
        animateCharacter(mesh, body.velocity);

        // Ground check for jumping
        const raycaster = new THREE.Raycaster(
          new THREE.Vector3(body.position.x, body.position.y, body.position.z),
          new THREE.Vector3(0, -1, 0),
          0,
          1.2 // Increased from 0.6 for better ground detection
        );
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
          if (characterRef.current.isJumping) {
            characterRef.current.isJumping = false;
          }
          characterRef.current.canJump = true;

          // Add slight position correction to prevent floating
          if (intersects[0].distance < 1.1) {
            body.position.y = intersects[0].point.y + 1.1;
          }
        }

        // Portal interaction check
        let nearestNPC = null;
        let minDistance = INTERACTION_DISTANCE;

        npcMeshes.forEach((npc) => {
          const characterPosition = new THREE.Vector3(
            mesh.position.x,
            mesh.position.y,
            mesh.position.z
          );
          const npcPosition = npc.position;
          const distance = characterPosition.distanceTo(npcPosition);

          // Make NPCs look at player when nearby
          if (distance < INTERACTION_DISTANCE * 2) {
            const direction = new THREE.Vector3()
              .subVectors(characterPosition, npcPosition)
              .normalize();
            npc.rotation.y = Math.atan2(direction.x, direction.z);
          }

          if (distance < INTERACTION_DISTANCE) {
            if (!nearestNPC || distance < minDistance) {
              minDistance = distance;
              nearestNPC = npc;
            }
          }
        });
        // Update portal interaction state
        if (nearestNPC) {
          if (activePortalRef.current !== nearestNPC) {
            activePortalRef.current = nearestNPC;
            setNearPortal(nearestNPC);
            setShowPortalPrompt(true);
            setPortalMessage(`Press E to talk to ${nearestNPC.userData.name}`);
          }
        } else if (activePortalRef.current) {
          activePortalRef.current = null;
          setNearPortal(null);
          setShowPortalPrompt(false);
          setPortalMessage("");
        }
        // Smooth camera follow with lag
        const idealOffset = new THREE.Vector3(
          mesh.position.x,
          mesh.position.y + 5,
          mesh.position.z + 10
        );

        camera.position.lerp(idealOffset, 0.1);
        camera.lookAt(mesh.position);
      }

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Window resize handler
    const handleResize = () => {
      if (containerRef.current && rendererRef.current && cameraRef.current) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        rendererRef.current.setSize(width, height);
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      // Clear refs on cleanup
      cameraRef.current = null;
      characterRef.current = null;
      worldRef.current = null;
      activePortalRef.current = null;
    };
  }, []);

  // Enhanced UI styles
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {showPortalPrompt && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "15px",
            color: "white",
            fontFamily: "Inter, sans-serif",
            textAlign: "center",
          }}
        >
          {portalMessage}
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "15px 30px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "30px",
          color: "white",
          fontFamily: "Inter, sans-serif",
          textAlign: "center",
        }}
      >
        <p>WASD to Move | SPACE to Jump | E to Talk | M to Meditate</p>
      </div>
    </div>
  );
};

export default InteractiveMentalHealthSpace;
