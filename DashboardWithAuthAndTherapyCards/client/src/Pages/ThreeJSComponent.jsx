import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const ThreeJSComponent = () => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const aspect = width / height;

    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const createStall = (
      content = {
        title: "Mental Health Condition",
        description: "Information about the condition",
        symptoms: ["Symptom 1", "Symptom 2", "Symptom 3"],
        treatment: "Treatment information",
      },
      position = { x: 0, z: 0 },
      rotation = 0
    ) => {
      const stallGroup = new THREE.Group();

      // Create stall structure
      const stallBase = new THREE.BoxGeometry(4, 0.1, 3);
      const stallBaseMesh = new THREE.Mesh(
        stallBase,
        new THREE.MeshPhongMaterial({ color: 0x8b4513 })
      );
      stallBaseMesh.receiveShadow = true;

      // Create stall walls
      const wallGeometry = new THREE.BoxGeometry(0.1, 3, 3);
      const wallMaterial = new THREE.MeshPhongMaterial({ color: 0xcd853f });

      // Back wall
      const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
      backWall.position.x = -2;
      backWall.position.y = 1.5;

      // Side walls
      const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
      leftWall.position.x = -2;
      leftWall.position.y = 1.5;
      leftWall.position.z = 1.5;
      leftWall.rotation.y = Math.PI / 2;

      const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
      rightWall.position.x = -2;
      rightWall.position.y = 1.5;
      rightWall.position.z = -1.5;
      rightWall.rotation.y = Math.PI / 2;

      // Create information board
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = 512;
      canvas.height = 512;

      // Set background
      context.fillStyle = "#FFF8DC";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Add text content
      context.fillStyle = "#000000";
      context.font = "bold 36px Arial";
      context.textAlign = "center";
      context.fillText(content.title, canvas.width / 2, 50);

      context.font = "24px Arial";
      context.textAlign = "left";
      const lines = content.description.split("\n");
      lines.forEach((line, i) => {
        context.fillText(line, 20, 100 + i * 30);
      });

      context.font = "bold 24px Arial";
      context.fillText("Symptoms:", 20, 220);
      context.font = "24px Arial";
      content.symptoms.forEach((symptom, i) => {
        context.fillText(`• ${symptom}`, 30, 250 + i * 30);
      });

      context.font = "bold 24px Arial";
      context.fillText("Treatment:", 20, 380);
      context.font = "24px Arial";
      const treatmentLines = content.treatment.split("\n");
      treatmentLines.forEach((line, i) => {
        context.fillText(line, 30, 410 + i * 30);
      });

      const texture = new THREE.CanvasTexture(canvas);
      const boardGeometry = new THREE.PlaneGeometry(3, 3);
      const boardMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      const board = new THREE.Mesh(boardGeometry, boardMaterial);
      board.position.x = -1.95;
      board.position.y = 1.5;
      board.rotation.y = Math.PI / 2;

      stallGroup.add(stallBaseMesh);
      stallGroup.add(backWall);
      stallGroup.add(leftWall);
      stallGroup.add(rightWall);
      stallGroup.add(board);

      // Set position and rotation
      stallGroup.position.set(position.x, 0, position.z);
      stallGroup.rotation.y = rotation;

      return stallGroup;
    };

    // Define stall contents
    const stallContents = [
      {
        title: "Depression",
        description:
          "A mental health disorder characterized by\npersistently depressed mood or loss of interest\nin activities.",
        symptoms: [
          "Persistent sad mood",
          "Loss of interest",
          "Changes in sleep patterns",
          "Fatigue",
          "Difficulty concentrating",
        ],
        treatment:
          "Therapy, medication, lifestyle changes,\nand social support",
      },
      {
        title: "Anxiety Disorders",
        description:
          "A group of mental health disorders characterized\nby significant anxiety and fear.",
        symptoms: [
          "Excessive worry",
          "Restlessness",
          "Rapid heartbeat",
          "Difficulty sleeping",
          "Panic attacks",
        ],
        treatment:
          "Cognitive behavioral therapy,\nmedication, relaxation techniques",
      },
      {
        title: "PTSD",
        description:
          "Post-traumatic stress disorder develops after\nexposure to a traumatic event.",
        symptoms: [
          "Flashbacks",
          "Nightmares",
          "Severe anxiety",
          "Uncontrollable thoughts",
          "Avoidance behaviors",
        ],
        treatment: "Trauma-focused therapy,\nEMDR therapy, medication",
      },
      {
        title: "Bipolar Disorder",
        description:
          "A mental health condition that causes extreme\nmood swings.",
        symptoms: [
          "Manic episodes",
          "Depressive episodes",
          "Changes in energy levels",
          "Sleep disturbances",
          "Impulsive behavior",
        ],
        treatment: "Mood stabilizers, psychotherapy,\nlifestyle management",
      },
    ];

    // Function to create and position all stalls
    const createStalls = (positions) => {
      // Remove any existing stalls first
      const existingStalls = scene.children.filter((child) => child.isGroup);
      existingStalls.forEach((stall) => scene.remove(stall));

      // Create new stalls with the specified positions
      positions.forEach((pos, index) => {
        const stall = createStall(
          stallContents[index],
          { x: pos.x, z: pos.z },
          pos.rotation || 0
        );
        scene.add(stall);
      });
    };

    // Example usage:
    const updateStallPositions = () => {
      const positions = [
        { x: -10, z: -10, rotation: 0 }, // Stall 1
        { x: -10, z: 10, rotation: 0 }, // Stall 2
        { x: 10, z: -10, rotation: Math.PI }, // Stall 3
        { x: 10, z: 10, rotation: Math.PI }, // Stall 4
      ];

      createStalls(positions);
    };
    updateStallPositions();

    // Create information board
    const createInfoBoard = (
      content = {
        title: "Mental Health Awareness",
        subtitle: "Key Points to Remember",
        lines: [
          "• Mental health is as important as physical health",
          "• Its okay to ask for help when needed",
          "• Practice self-care daily",
          "• Support others in their journey",
          "• Break the stigma through education",
        ],
      }
    ) => {
      const boardGroup = new THREE.Group();

      // Board backing
      const boardGeometry = new THREE.BoxGeometry(6, 4, 0.2);
      const boardMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
      const board = new THREE.Mesh(boardGeometry, boardMaterial);
      board.position.y = 2;
      board.castShadow = true;
      board.receiveShadow = true;

      // Create text canvas
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = 1024;
      canvas.height = 512;
      context.fillStyle = "#FFF8DC";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Add text
      context.fillStyle = "#000000";
      context.font = "bold 48px Arial";
      context.textAlign = "center";
      context.fillText(content.title, canvas.width / 2, 60);

      context.font = "32px Arial";
      context.fillText(content.subtitle, canvas.width / 2, 120);

      context.font = "28px Arial";
      context.textAlign = "left";

      content.lines.forEach((line, index) => {
        context.fillText(line, 40, 200 + index * 50);
      });

      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      const textPlaneGeometry = new THREE.PlaneGeometry(5.8, 3.8);
      const textPlaneMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      const textPlane = new THREE.Mesh(textPlaneGeometry, textPlaneMaterial);
      textPlane.position.z = 0.11;
      textPlane.position.y = 2;

      boardGroup.add(board);
      boardGroup.add(textPlane);
      return boardGroup;
    };

    // Example usage for multiple boards:
    const boardContents = [
      {
        title: "Mental Health Awareness",
        subtitle: "Key Points to Remember",
        lines: [
          "• Mental health is as important as physical health",
          "• Its okay to ask for help when needed",
          "• Practice self-care daily",
          "• Support others in their journey",
          "• Break the stigma through education",
        ],
      },
      {
        title: "Stress Management",
        subtitle: "Coping Strategies",
        lines: [
          "• Practice deep breathing exercises",
          "• Maintain a regular sleep schedule",
          "• Exercise regularly",
          "• Connect with loved ones",
          "• Take breaks when needed",
        ],
      },
      {
        title: "Self-Care Tips",
        subtitle: "Daily Practices",
        lines: [
          "• Set healthy boundaries",
          "• Practice mindfulness",
          "• Maintain a balanced diet",
          "• Engage in hobbies",
          "• Get regular exercise",
        ],
      },
      {
        title: "Emotional Wellness",
        subtitle: "Understanding Emotions",
        lines: [
          "• Recognize your feelings",
          "• Express emotions healthily",
          "• Seek support when needed",
          "• Practice empathy",
          "• Develop emotional awareness",
        ],
      },
    ];
    const createTree = (x, z, scale = 1) => {
      const treeGroup = new THREE.Group();

      // Trunk with random variation
      const trunkHeight = 2 + Math.random() * 1; // Height varies between 2-3
      const trunkGeometry = new THREE.CylinderGeometry(
        0.2 * scale,
        0.3 * scale,
        trunkHeight,
        8
      );
      const trunkMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(0x8b4513).offsetHSL(
          0,
          0,
          Math.random() * 0.2 - 0.1
        ),
      });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);

      // Multiple layers of leaves with random variation
      const createLeafLayer = (y, size) => {
        const leavesGeometry = new THREE.ConeGeometry(
          size * scale,
          size * 1.5 * scale,
          8
        );
        const leavesMaterial = new THREE.MeshPhongMaterial({
          color: new THREE.Color(0x228b22).offsetHSL(
            0,
            0,
            Math.random() * 0.2 - 0.1
          ),
        });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = y;
        return leaves;
      };

      // Add multiple leaf layers
      const leafLayers = [
        { y: trunkHeight + 0.2, size: 1.5 },
        { y: trunkHeight + 1, size: 1.2 },
        { y: trunkHeight + 1, size: 0.9 },
      ];

      leafLayers.forEach((layer) => {
        treeGroup.add(createLeafLayer(layer.y, layer.size));
      });

      treeGroup.add(trunk);
      treeGroup.position.set(x, 0, z);

      // Random rotation for natural variation
      treeGroup.rotation.y = Math.random() * Math.PI * 2;

      treeGroup.castShadow = true;
      treeGroup.receiveShadow = true;

      return treeGroup;
    };

    // Function to create dense tree walls
    const createTreeWalls = () => {
      const trees = [];
      const floorSize = 50;
      const spacing = 2.5; // Space between trees
      const offset = 1; // Offset from the edge
      const variation = 0.5; // Random position variation

      // Helper function to add trees in a line
      const addTreeLine = (startX, startZ, count, isXAxis) => {
        for (let i = 0; i < count; i++) {
          const scale = 0.8 + Math.random() * 0.4; // Random scale between 0.8 and 1.2
          let x, z;

          if (isXAxis) {
            x =
              startX +
              i * spacing +
              (Math.random() * variation - variation / 2);
            z = startZ + (Math.random() * variation - variation / 2);
          } else {
            x = startX + (Math.random() * variation - variation / 2);
            z =
              startZ +
              i * spacing +
              (Math.random() * variation - variation / 2);
          }

          // Add multiple rows for density
          for (let row = 0; row < 3; row++) {
            const rowOffset = row * 1.5;
            const xPos = isXAxis ? x : x + rowOffset * (startX > 0 ? -1 : 1);
            const zPos = isXAxis ? z + rowOffset * (startZ > 0 ? -1 : 1) : z;
            trees.push(createTree(xPos, zPos, scale));
          }
        }
      };

      // Calculate number of trees needed for each wall
      const treesPerSide = Math.floor(floorSize / spacing);

      // Create four walls of trees
      // North wall
      addTreeLine(-floorSize / 2, -floorSize / 2 + offset, treesPerSide, true);
      // South wall
      addTreeLine(-floorSize / 2, floorSize / 2 - offset, treesPerSide, true);
      // East wall
      addTreeLine(-floorSize / 2 + offset, -floorSize / 2, treesPerSide, false);
      // West wall
      addTreeLine(floorSize / 2 - offset, -floorSize / 2, treesPerSide, false);

      // Add corner clusters for fuller appearance
      const cornerPositions = [
        { x: -floorSize / 2 + offset, z: -floorSize / 2 + offset },
        { x: -floorSize / 2 + offset, z: floorSize / 2 - offset },
        { x: floorSize / 2 - offset, z: -floorSize / 2 + offset },
        { x: floorSize / 2 - offset, z: floorSize / 2 - offset },
      ];

      cornerPositions.forEach((pos) => {
        for (let i = 0; i < 0; ) {
          for (let j = 0; j < 5; j++) {
            const x = pos.x + i * 1.5 * (pos.x > 0 ? -1 : 1);
            const z = pos.z + j * 1.5 * (pos.z > 0 ? -1 : 1);
            trees.push(createTree(x, z, 0.8 + Math.random() * 0.4));
          }
        }
      });

      return trees;
    };

    // Add scattered trees in the central area (fewer than before)
    const addScatteredTrees = () => {
      const trees = [];
      const innerSize = 30; // Smaller area for scattered trees

      for (let i = 0; i < 15; i++) {
        const x = (Math.random() - 0.5) * innerSize;
        const z = (Math.random() - 0.5) * innerSize;

        // Don't place trees too close to boards, stalls, or spawn point
        if (Math.abs(x) > 5 && Math.abs(z) > 5) {
          trees.push(createTree(x, z, 0.8 + Math.random() * 0.4));
        }
      }
      return trees;
    };

    // Add all trees to the scene
    const treeWalls = createTreeWalls();
    const scatteredTrees = addScatteredTrees();
    [...treeWalls, ...scatteredTrees].forEach((tree) => scene.add(tree));

    const createBoards = () => {
      const boardPositions = [
        { x: 0, z: -5, rotation: 0 }, // Front board
        { x: -5, z: 0, rotation: Math.PI / 2 }, // Left board
        { x: 5, z: 0, rotation: -Math.PI / 2 }, // Right board
        { x: 0, z: 5, rotation: Math.PI }, // Back board
      ];

      boardPositions.forEach((pos, index) => {
        const board = createInfoBoard(boardContents[index]);
        board.position.set(pos.x, 0, pos.z);
        board.rotation.y = pos.rotation;
        scene.add(board);
      });
    };

    const infoBoard = createInfoBoard();
    infoBoard.position.z = -5;
    scene.add(infoBoard);

    // Ground plane with better material
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshPhongMaterial({
      color: 0x90ee90,
      side: THREE.DoubleSide,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = Math.PI / 2;
    ground.position.y = -1;
    ground.receiveShadow = true;
    scene.add(ground);
    createBoards();

    let model;
    const loader = new GLTFLoader();
    loader.load(
      "../models/bunny.gltf",
      (gltf) => {
        model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);
        model.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        scene.add(model);
        setLoading(false);
      },
      (progress) => {
        console.log(
          "Loading progress:",
          (progress.loaded / progress.total) * 100 + "%"
        );
      },
      (error) => {
        console.error("Model loading error:", error);
        setError("Failed to load 3D model");
        setLoading(false);
      }
    );

    const cameraOffset = new THREE.Vector3(0, 3, 8);
    const rotationSpeed = 0.05;
    const keysPressed = new Set();
    let modelRotation = 0;

    const handleKeyDown = (event) => {
      keysPressed.add(event.key);
    };

    const handleKeyUp = (event) => {
      keysPressed.delete(event.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Improved movement parameters
    const velocity = new THREE.Vector3();
    const acceleration = 2; // Reduced for more controlled acceleration
    const deceleration = 1; // Adjusted for smoother stops
    const maxSpeed = 0.5; // Reduced for better control
    const rotationAcceleration = 0.1; // Smooth rotation acceleration
    let currentRotationVelocity = 0;
    const maxRotationSpeed = 0.05;
    const rotationDeceleration = 1;

    const animate = () => {
      const animationId = requestAnimationFrame(animate);

      if (model) {
        // Separate rotation and movement handling
        let wantToRotate = false;
        let rotationDirection = 0;
        let moveForward = false;
        let moveBackward = false;

        keysPressed.forEach((key) => {
          switch (key) {
            case "ArrowUp":
              moveForward = true;
              break;
            case "ArrowDown":
              moveBackward = true;
              break;
            case "ArrowLeft":
              wantToRotate = true;
              rotationDirection = 1.5;
              break;
            case "ArrowRight":
              wantToRotate = true;
              rotationDirection = -1.5;
              break;
          }
        });

        // Handle rotation with smooth acceleration/deceleration
        if (wantToRotate) {
          currentRotationVelocity += rotationAcceleration * rotationDirection;
          currentRotationVelocity = THREE.MathUtils.clamp(
            currentRotationVelocity,
            -maxRotationSpeed,
            maxRotationSpeed
          );
        } else {
          // Apply rotation deceleration
          if (Math.abs(currentRotationVelocity) > 0.0001) {
            currentRotationVelocity *= 1 - rotationDeceleration;
          } else {
            currentRotationVelocity = 0;
          }
        }

        modelRotation += currentRotationVelocity;
        model.rotation.y = modelRotation;

        // Handle movement
        const forward = new THREE.Vector3(
          -Math.sin(modelRotation),
          0,
          -Math.cos(modelRotation)
        );

        const backward = forward.clone().negate();

        // Apply movement based on direction
        if (moveForward) {
          velocity.add(forward.multiplyScalar(acceleration));
        }
        if (moveBackward) {
          velocity.add(backward.multiplyScalar(acceleration));
        }

        // Apply deceleration when no movement input
        if (!moveForward && !moveBackward) {
          velocity.multiplyScalar(1 - deceleration);
        }

        // Limit maximum speed
        if (velocity.length() > maxSpeed) {
          velocity.normalize().multiplyScalar(maxSpeed);
        }

        // Update model position
        model.position.add(velocity);

        // Smooth camera following
        const idealOffset = new THREE.Vector3(
          Math.sin(modelRotation) * cameraOffset.z,
          cameraOffset.y,
          Math.cos(modelRotation) * cameraOffset.z
        );

        const idealLookAt = new THREE.Vector3(
          model.position.x,
          model.position.y + 1,
          model.position.z
        );

        camera.position.lerp(idealOffset.add(model.position), 0.1);
        camera.lookAt(idealLookAt);
      }

      renderer.render(scene, camera);

      return () => {
        cancelAnimationFrame(animationId);
      };
    };

    const animationCleanup = animate();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", handleResize);
      animationCleanup();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />

      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <p className="text-white text-lg">Loading virtual environment...</p>
        </div>
      )}

      {error && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      )}

      <div className="absolute bottom-4 left-4 w-80 bg-white/80 backdrop-blur rounded-lg shadow-lg">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">Controls</h2>
          <p className="text-sm">
            • Use Arrow Up/Down to move forward/backward
            <br />
            • Use Arrow Left/Right to rotate the character
            <br />• Approach the board to read about mental health awareness
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThreeJSComponent;
