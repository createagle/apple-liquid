"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"
import { Camera, Geometry, Mesh, Program, Renderer } from "ogl"
import { cn } from "cn"

interface ParticlesProps extends React.ComponentProps<"div"> {
  /** 粒子颜色，只认 #rgb / #rrggbb，每颗粒子随机取一个。 */
  particleColors?: string[]
  particleCount?: number
  /** 粒子分布的半径。 */
  particleSpread?: number
  speed?: number
  particleBaseSize?: number
  /** 0 时所有粒子一样大。 */
  sizeRandomness?: number
  /** 鼠标移动时整团粒子反向轻移；监听的是 window，背景放在内容下面也能跟随。 */
  moveParticlesOnHover?: boolean
  particleHoverFactor?: number
  /** 粒子边缘柔化、半透明；关掉则是实心圆点。 */
  alphaParticles?: boolean
  disableRotation?: boolean
  cameraDistance?: number
  pixelRatio?: number
}

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;

  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vRandom = random;
    vColor = color;

    vec3 pos = position * uSpread;
    pos.z *= 10.0;

    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);

    vec4 mvPos = viewMatrix * mPos;
    if (uSizeRandomness == 0.0) {
      gl_PointSize = uBaseSize;
    } else {
      gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    }
    gl_Position = projectionMatrix * mvPos;
  }
`

const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));

    if (uAlphaParticles < 0.5) {
      if (d > 0.5) discard;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`

function hexToRgb(hex: string): [number, number, number] {
  let value = hex.replace(/^#/, "")
  if (value.length === 3) value = [...value].map((c) => c + c).join("")
  const int = parseInt(value, 16)
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255]
}

const DEFAULT_COLORS = ["#ffffff"]

/**
 * WebGL 粒子背景（基于 ogl，移植自 React Bits 的 Particles）。
 * 画布铺满容器、不拦截点击；用户开启「减少动态效果」时只画一帧静止画面。
 */
function Particles({
  particleColors = DEFAULT_COLORS,
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleBaseSize = 100,
  sizeRandomness = 1,
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  disableRotation = false,
  cameraDistance = 20,
  pixelRatio = 1,
  className,
  ...props
}: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // 颜色数组每次渲染都可能是新引用，按内容比较，避免无谓地重建画布。
  const colorsKey = particleColors.join(",")

  useEffect(() => {
    const container = containerRef.current
    // 颜色还没确定时（比如等主题色读出来）先不画，免得闪一帧错的颜色。
    if (!container || !colorsKey) return

    const renderer = new Renderer({ dpr: pixelRatio, depth: false, alpha: true })
    const gl = renderer.gl
    gl.canvas.style.display = "block"
    gl.canvas.style.width = "100%"
    gl.canvas.style.height = "100%"
    container.appendChild(gl.canvas)
    gl.clearColor(0, 0, 0, 0)

    const camera = new Camera(gl, { fov: 15 })
    camera.position.set(0, 0, cameraDistance)

    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight)
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height })
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    const mouse = { x: 0, y: 0 }
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
    }
    if (moveParticlesOnHover) window.addEventListener("mousemove", handleMouseMove)

    const palette = colorsKey.split(",")
    const positions = new Float32Array(particleCount * 3)
    const randoms = new Float32Array(particleCount * 4)
    const colors = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      // 在单位球内均匀取点
      let x: number, y: number, z: number, len: number
      do {
        x = Math.random() * 2 - 1
        y = Math.random() * 2 - 1
        z = Math.random() * 2 - 1
        len = x * x + y * y + z * z
      } while (len > 1 || len === 0)
      const r = Math.cbrt(Math.random())
      positions.set([x * r, y * r, z * r], i * 3)
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4)
      colors.set(hexToRgb(palette[Math.floor(Math.random() * palette.length)]), i * 3)
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors },
    })
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize * pixelRatio },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1 : 0 },
      },
      transparent: true,
      depthTest: false,
    })
    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program })

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let frame = 0
    let lastTime = performance.now()
    let elapsed = 0

    const update = (time: number) => {
      const delta = time - lastTime
      lastTime = time
      elapsed += delta * speed
      program.uniforms.uTime.value = elapsed * 0.001

      if (moveParticlesOnHover) {
        particles.position.x = -mouse.x * particleHoverFactor
        particles.position.y = -mouse.y * particleHoverFactor
      }
      if (!disableRotation) {
        particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1
        particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15
        particles.rotation.z += 0.01 * speed
      }

      renderer.render({ scene: particles, camera })
      if (!reducedMotion) frame = requestAnimationFrame(update)
    }
    frame = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener("mousemove", handleMouseMove)
      gl.canvas.remove()
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    }
  }, [
    colorsKey,
    particleCount,
    particleSpread,
    speed,
    particleBaseSize,
    sizeRandomness,
    moveParticlesOnHover,
    particleHoverFactor,
    alphaParticles,
    disableRotation,
    cameraDistance,
    pixelRatio,
  ])

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none relative size-full", className)}
      {...props}
    />
  )
}

/**
 * 当前主题色（--primary）转成 #rrggbb。--primary 随明暗主题和外观设置里的主色变化，
 * 两者都写在 <html> 的 class / style 上，监听这两个属性即可跟上。
 */
function subscribePrimary(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] })
  return () => observer.disconnect()
}

let colorContext: CanvasRenderingContext2D | null | undefined

function readPrimary() {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim()
  // 借 canvas 把任意 CSS 颜色规整成十六进制；解析不了时返回空串。
  colorContext ??= document.createElement("canvas").getContext("2d")
  const context = colorContext
  if (!context || !value) return ""
  context.fillStyle = "#000000"
  context.fillStyle = value
  return context.fillStyle.startsWith("#") ? context.fillStyle : ""
}

/** 和白色按比例混合，得到同色相的浅色粒子，让画面有层次。 */
function lighten(hex: string, amount: number) {
  const channels = hexToRgb(hex).map((c) => Math.round((c + (1 - c) * amount) * 255))
  return `#${channels.map((c) => c.toString(16).padStart(2, "0")).join("")}`
}

/**
 * 粒子颜色跟随网站主题色，切换明暗或在外观设置里换主色时立即更新。
 * 拿不到主色（服务端首屏）时不创建画布，也就不占用 WebGL 和动画帧。
 */
function ThemedParticles(props: Omit<ParticlesProps, "particleColors">) {
  // 服务端拿不到主题色，返回空串；颜色不进 DOM，水合时结构一致。
  const primary = useSyncExternalStore(subscribePrimary, readPrimary, () => "")
  const colors = primary ? [primary, lighten(primary, 0.45)] : []
  return <Particles particleColors={colors} {...props} />
}

export { Particles, ThemedParticles }
export type { ParticlesProps }
