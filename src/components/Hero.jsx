import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Environment, MeshWobbleMaterial, ContactShadows, PresentationControls } from '@react-three/drei'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { ArrowRight, Zap, Activity, Shield, Target } from 'lucide-react'
import * as THREE from 'three'

const Balloon = ({ position, color, popped }) => {
    const mesh = useRef()

    useFrame((state) => {
        if (mesh.current && !popped) {
            mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2
            mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
        }
    })

    return (
        <group ref={mesh} position={[position[0], position[1], position[2]]}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* Glossy Pink Balloon Body */}
                <mesh visible={!popped}>
                    <sphereGeometry args={[0.45, 32, 32]} />
                    <meshStandardMaterial
                        color="#FF4B91"
                        metalness={0.2}
                        roughness={0.1}
                        emissive="#FF4B91"
                        emissiveIntensity={0.2}
                    />
                </mesh>
                {/* Balloon Tie */}
                <mesh visible={!popped} position={[0, -0.45, 0]}>
                    <coneGeometry args={[0.08, 0.1, 16]} />
                    <meshStandardMaterial color="#FF4B91" />
                </mesh>
                {/* White Curved String */}
                <mesh visible={!popped} position={[0, -0.85, 0]}>
                    <cylinderGeometry args={[0.01, 0.01, 0.8]} />
                    <meshBasicMaterial color="white" transparent opacity={0.6} />
                </mesh>
            </Float>
        </group>
    )
}

const Gun = ({ targetPos, shooting }) => {
    const ref = useRef()

    useFrame((state) => {
        if (ref.current) {
            if (targetPos) {
                const target = new THREE.Vector3(...targetPos)
                ref.current.lookAt(target)
            }
            // Add a small recoil when shooting
            if (shooting) {
                ref.current.position.z += 0.2
            } else {
                ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, 4, 0.1)
            }
            // Gentle floating
            ref.current.position.y = -1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1
        }
    })

    return (
        <group position={[0, -1.5, 4]} ref={ref}>
            <group rotation={[0, -Math.PI / 2, 0]} scale={0.7}>
                {/* Barrel - Gold */}
                <mesh position={[1.5, 0.4, 0]} rotation={[0, 0, -Math.PI / 2]}>
                    <cylinderGeometry args={[0.15, 0.2, 1.8, 32]} />
                    <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
                </mesh>

                {/* Main Body - Gold */}
                <mesh position={[0.2, 0.4, 0]}>
                    <boxGeometry args={[1, 0.8, 0.4]} />
                    <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
                </mesh>

                {/* Cylinder (Ammo part) - Silver */}
                <mesh position={[0.2, 0.45, 0]} rotation={[0, 0, -Math.PI / 2]}>
                    <cylinderGeometry args={[0.35, 0.35, 0.7, 6]} />
                    <meshStandardMaterial color="#E5E7EB" metalness={1} roughness={0.05} />
                </mesh>

                {/* Grip/Handle - Leather Wood with Gears */}
                <group position={[-0.4, -0.3, 0]}>
                    <mesh rotation={[0.4, 0, 0]}>
                        <boxGeometry args={[0.5, 1.2, 0.3]} />
                        <meshStandardMaterial color="#8B4513" metalness={0.2} roughness={0.8} />
                    </mesh>
                    {/* Small Gear decoration */}
                    <mesh position={[0, 0, 0.16]} rotation={[0, 0, Math.PI / 4]}>
                        <torusGeometry args={[0.1, 0.05, 16, 6]} />
                        <meshStandardMaterial color="#FFD700" metalness={1} />
                    </mesh>
                </group>

                {/* Hammer - Silver */}
                <mesh position={[-0.4, 0.8, 0]} rotation={[0, 0, 0.5]}>
                    <boxGeometry args={[0.1, 0.3, 0.1]} />
                    <meshStandardMaterial color="#E5E7EB" metalness={1} />
                </mesh>

                {/* Trigger Guard - Gold */}
                <mesh position={[0.4, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <torusGeometry args={[0.2, 0.04, 16, 32, Math.PI]} />
                    <meshStandardMaterial color="#FFD700" metalness={1} />
                </mesh>
            </group>

            {/* Laser/Bullet FX when shooting */}
            {shooting && (
                <group position={[0, 0.3, -0.5]}>
                    <mesh position={[0, 0, -5]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.02, 0.02, 10]} />
                        <meshBasicMaterial color="#FFEB3B" />
                    </mesh>
                    <pointLight intensity={50} color="#FFEB3B" distance={10} />
                </group>
            )}
        </group>
    )
}

const Basketball = ({ isShooting }) => {
    const mesh = useRef();
    const startPos = [-7, -1, 3];
    const hoopPos = [5, 1.25, -4]; // Center of rim

    useFrame((state) => {
        if (!mesh.current) return;

        if (isShooting) {
            const duration = 2.5;
            const t = (state.clock.elapsedTime % duration) / duration;

            if (t < 0.6) {
                // Phase 1: The Arc to the Hoop
                const arcT = t / 0.6;
                const x = THREE.MathUtils.lerp(startPos[0], hoopPos[0], arcT);
                const y = startPos[1] + (hoopPos[1] - startPos[1]) * arcT + Math.sin(arcT * Math.PI) * 6;
                const z = THREE.MathUtils.lerp(startPos[2], hoopPos[2], arcT);
                mesh.current.position.set(x, y, z);
            } else {
                // Phase 2: Falling through and down
                const fallT = (t - 0.6) / 0.4;
                const gravity = 15;
                const x = hoopPos[0];
                const z = hoopPos[2];
                const y = hoopPos[1] - (0.5 * gravity * fallT * fallT);
                mesh.current.position.set(x, y, z);
            }

            mesh.current.rotation.x += 0.15;
            mesh.current.rotation.y += 0.1;
        } else {
            mesh.current.position.set(...startPos);
        }
    });

    return (
        <group ref={mesh}>
            <mesh castShadow>
                <sphereGeometry args={[0.35, 32, 32]} />
                <meshStandardMaterial
                    color="#FF7A18"
                    roughness={0.6}
                    metalness={0.1}
                    emissive="#FF7A18"
                    emissiveIntensity={0.3}
                />
            </mesh>
            {/* Real Basketball Lines */}
            {[0, Math.PI / 2].map((rot, i) => (
                <mesh key={i} rotation={[rot, 0, 0]}>
                    <torusGeometry args={[0.352, 0.01, 16, 64]} />
                    <meshBasicMaterial color="#111" />
                </mesh>
            ))}
        </group>
    );
};

const Hoop = () => {
    return (
        <group position={[5, 0.5, -4]}>
            {/* The Main Support Pole */}
            <mesh position={[0.8, -4, -1]}>
                <cylinderGeometry args={[0.15, 0.15, 12]} />
                <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* The Neck/Arm */}
            <mesh position={[0.4, 1.5, -0.75]} rotation={[-Math.PI / 6, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 1]} />
                <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Backboard Assembly */}
            <group position={[0, 1.5, -0.2]}>
                {/* Glass Backboard */}
                <mesh>
                    <boxGeometry args={[2.8, 2, 0.1]} />
                    <meshPhysicalMaterial
                        transparent
                        opacity={0.4}
                        roughness={0}
                        metalness={0}
                        transmission={0.9}
                        thickness={0.5}
                        color="white"
                    />
                </mesh>
                {/* White Outer Frame */}
                <mesh>
                    <boxGeometry args={[2.85, 2.05, 0.05]} />
                    <meshBasicMaterial color="white" wireframe />
                </mesh>
                {/* Orange Inner Shot Box */}
                <mesh position={[0, -0.3, 0.06]}>
                    <boxGeometry args={[0.8, 0.6, 0.01]} />
                    <meshBasicMaterial color="#FF3D3D" wireframe />
                </mesh>
            </group>

            {/* Rim System */}
            <group position={[0, 0.75, 0.5]}>
                {/* Orange Rim */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.5, 0.04, 16, 100]} />
                    <meshStandardMaterial color="#FF3D3D" emissive="#FF3D3D" emissiveIntensity={3} />
                </mesh>
                {/* Net - Tapered mesh */}
                <mesh position={[0, -0.4, 0]} rotation={[0, 0, 0]}>
                    <cylinderGeometry args={[0.5, 0.3, 0.9, 16, 1, true]} />
                    <meshBasicMaterial color="white" wireframe transparent opacity={0.3} />
                </mesh>
            </group>
        </group>
    );
};

const ShootingGame = () => {
    const [balloons, setBalloons] = useState([])
    const [activeTargetIndex, setActiveTargetIndex] = useState(-1)
    const [isShooting, setIsShooting] = useState(false)
    const [isHooping, setIsHooping] = useState(false)

    const initGame = () => {
        setBalloons([
            { id: Date.now() + 1, pos: [-4, 3, -2], color: '#FF7A18', popped: false },
            { id: Date.now() + 2, pos: [4, 2, -3], color: '#5B8CFF', popped: false },
            { id: Date.now() + 3, pos: [-2, 5, -5], color: '#FF3D3D', popped: false },
        ])
        setActiveTargetIndex(0)
    }

    useEffect(() => {
        const timer = setTimeout(initGame, 1500)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (activeTargetIndex >= 0 && activeTargetIndex < balloons.length) {
            const shootDelay = setTimeout(() => {
                setIsShooting(true)
                const popDelay = setTimeout(() => {
                    setBalloons(prev => prev.map((b, i) => i === activeTargetIndex ? { ...b, popped: true } : b))
                    setIsShooting(false)
                    setActiveTargetIndex(prev => prev + 1)
                }, 100)
                return () => clearTimeout(popDelay)
            }, 600)
            return () => clearTimeout(shootDelay)
        } else if (activeTargetIndex === balloons.length && balloons.length > 0) {
            // After balloons, start the basketball sequence
            setIsHooping(true)
            const hoopTimer = setTimeout(() => {
                setIsHooping(false)
                setActiveTargetIndex(-1)
                setBalloons([])
                const restartTimer = setTimeout(initGame, 1000)
                return () => clearTimeout(restartTimer)
            }, 2500)
            return () => clearTimeout(hoopTimer)
        }
    }, [activeTargetIndex, balloons.length])

    return (
        <group>
            {balloons.map((b, i) => (
                <Balloon key={b.id} position={b.pos} color={b.color} popped={b.popped} />
            ))}
            {activeTargetIndex >= 0 && activeTargetIndex < balloons.length && (
                <Gun targetPos={balloons[activeTargetIndex].pos} shooting={isShooting} />
            )}

            <Hoop />
            <Basketball isShooting={isHooping} />
        </group>
    )
}

const Sculpture = () => {
    const meshRef = useRef()

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15
        }
    })

    return (
        <group position={[0, 0, -3]}>
            <PresentationControls
                global
                config={{ mass: 2, tension: 500 }}
                snap={{ mass: 4, tension: 1500 }}
                rotation={[0, 0.3, 0]}
                polar={[-Math.PI / 3, Math.PI / 3]}
                azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
            >
                <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                    <mesh ref={meshRef}>
                        <torusKnotGeometry args={[1.6, 0.5, 128, 32]} />
                        <MeshDistortMaterial
                            color="#C41E3A"
                            speed={3}
                            distort={0.4}
                            radius={1}
                            roughness={0}
                            metalness={0.6}
                            emissive="#7B0000"
                            emissiveIntensity={0.5}
                            clearcoat={1}
                            clearcoatRoughness={0}
                        />
                    </mesh>
                </Float>
                <ContactShadows resolution={1024} scale={20} blur={2.5} opacity={0.2} far={6} color="#000000" />
            </PresentationControls>
        </group>
    )
}

const Hero = () => {
    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { margin: "200px" })
    const { scrollY } = useScroll()
    const y1 = useTransform(scrollY, [0, 500], [0, 150])
    const opacity = useTransform(scrollY, [0, 400], [1, 0])

    return (
        <section ref={containerRef} className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-[#070B14]">
            {/* Ambient Background */}
            <div className="absolute inset-0 matrix-grid opacity-10 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#FF7A18]/5 via-transparent to-transparent pointer-events-none" />

            {/* 3D Scene - Enhanced abstract sculpture */}
            <div className="absolute inset-0 z-0 mask-bottom opacity-60 md:opacity-100">
                {isInView && (
                    <Canvas
                        dpr={window.innerWidth < 768 ? 0.75 : 1}
                        camera={{ position: [0, 0, 8], fov: 40 }}
                        performance={{ min: 0.5 }}
                        gl={{ powerPreference: "high-performance", antialias: false, stencil: false, depth: true }}
                    >
                        <ambientLight intensity={0.4} />
                        <spotLight position={[10, 15, 10]} angle={0.25} penumbra={1} intensity={3} color="#FF7A18" />
                        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#5B8CFF" />
                        <Sculpture />
                        <ShootingGame />
                        <Environment preset="night" />
                    </Canvas>
                )}
            </div>

            {/* Content Layer */}
            <div className="container relative z-10 text-center px-6">
                <motion.div
                    style={{ y: y1, opacity }}
                    className="flex flex-col items-center"
                >

                    <h1 className="text-5xl md:text-[12rem] font-black mb-6 leading-[0.85] tracking-tighter uppercase italic transform -skew-x-12 text-[#F8FAFC]">
                        EAT. ENJOY.<br />
                        <span className="text-gradient-primary">ENTERTAIN.</span>
                    </h1>

                    <p className="max-w-2xl text-[#AAB2C5] text-xs md:text-sm font-bold uppercase tracking-[0.4em] mb-12 leading-relaxed italic opacity-70 border-l-2 border-[#FF7A18]/30 pl-6">
                        Experience the scenic beauty of Eluru with premium culinary standards and recreation.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-8">
                        <motion.a
                            href="/dine"
                            className="btn-premium px-16 py-6"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            BOOK YOUR RIDE <ArrowRight size={18} className="ml-2" />
                        </motion.a>

                    </div>
                </motion.div>
            </div>


            {/* Professional Directive HUD (Scroll Indicator) */}
            <motion.div
                className="absolute bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-4 z-20 cursor-pointer group lg:flex"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF7A18] animate-pulse" />
                    <span className="text-[10px] font-bold text-[#FF7A18] tracking-[0.3em] uppercase italic opacity-40">Scroll</span>
                </div>

                <div className="flex flex-col items-center">
                    <div className="relative h-12 flex flex-col items-center justify-center mb-2">
                        <motion.span
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="text-[14px] font-black text-white tracking-[0.4em] uppercase italic"
                        >
                            EXPLORE RIDES
                        </motion.span>
                    </div>

                    {/* Futuristic Scanning Line */}
                    <div className="relative w-48 h-[1px] bg-white/5 overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF7A18] to-transparent w-20"
                            animate={{ x: [-100, 300] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                </div>

                <div className="relative mt-2">
                    <div className="w-[1px] h-16 bg-gradient-to-b from-[#FF7A18] via-[#FF7A18]/20 to-transparent" />
                    <motion.div
                        className="absolute top-0 left-[-2px] w-[5px] h-[5px] bg-[#FF7A18] rounded-full shadow-[0_0_15px_#FF7A18]"
                        animate={{ y: [0, 60, 0], opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    />
                </div>
            </motion.div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .mask-bottom {
                    mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
                }
            `}} />
        </section>
    )
}

export default Hero
