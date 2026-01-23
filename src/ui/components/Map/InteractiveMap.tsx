import React, { useRef, useEffect, useState, useCallback } from 'react'
import type { MapGraph, MapNode } from '@models/navigation'
import type { Vector2D } from '@models/index'
import styles from './InteractiveMap.module.css'

interface InteractiveMapProps {
  mapGraph: MapGraph
  currentNodeId: string
  visitedNodeIds: string[]
  onNodeSelect?: (nodeId: string) => void
  onPlotCourse?: (nodeId: string) => void
}

interface ViewTransform {
  zoom: number
  pan: Vector2D
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  mapGraph,
  currentNodeId,
  visitedNodeIds,
  onNodeSelect,
  onPlotCourse,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [view, setView] = useState<ViewTransform>({
    zoom: 1,
    pan: { x: 0, y: 0 },
  })
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [lastMousePos, setLastMousePos] = useState<Vector2D>({ x: 0, y: 0 })

  // Render the map
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    renderMap(ctx, mapGraph, view, {
      currentNodeId,
      visitedNodeIds,
      hoveredNode,
      selectedNode: selectedNode?.id || null,
    })
  }, [mapGraph, view, currentNodeId, visitedNodeIds, hoveredNode, selectedNode])

  // Handle mouse wheel for zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setView((prev) => ({
      ...prev,
      zoom: Math.max(0.5, Math.min(3, prev.zoom - e.deltaY * 0.001)),
    }))
  }, [])

  // Handle mouse down for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsPanning(true)
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }, [])

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        const dx = e.clientX - lastMousePos.x
        const dy = e.clientY - lastMousePos.y
        setView((prev) => ({
          ...prev,
          pan: { x: prev.pan.x + dx, y: prev.pan.y + dy },
        }))
        setLastMousePos({ x: e.clientX, y: e.clientY })
      } else {
        // Check if hovering over a node
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        // Convert to world coordinates
        const worldX = (mouseX - view.pan.x) / view.zoom
        const worldY = (mouseY - view.pan.y) / view.zoom

        // Find hovered node
        const hoveredNodeId = findNodeAtPosition(mapGraph, worldX, worldY)
        setHoveredNode(hoveredNodeId)
      }
    },
    [isPanning, lastMousePos, mapGraph, view]
  )

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  // Handle click
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) return

      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Convert to world coordinates
      const worldX = (mouseX - view.pan.x) / view.zoom
      const worldY = (mouseY - view.pan.y) / view.zoom

      // Find clicked node
      const clickedNodeId = findNodeAtPosition(mapGraph, worldX, worldY)
      if (clickedNodeId) {
        const node = mapGraph.nodes.find((n) => n.id === clickedNodeId)
        if (node) {
          setSelectedNode(node)
          onNodeSelect?.(clickedNodeId)
        }
      } else {
        setSelectedNode(null)
      }
    },
    [isPanning, mapGraph, view, onNodeSelect]
  )

  return (
    <div className={styles.mapContainer}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className={styles.mapCanvas}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        style={{ cursor: isPanning ? 'grabbing' : hoveredNode ? 'pointer' : 'grab' }}
      />

      {selectedNode && (
        <div className={styles.nodeDetails}>
          <h3>{selectedNode.name}</h3>
          <p className={styles.nodeType}>{selectedNode.type}</p>
          {selectedNode.hasSettlement && <p>🏘️ Settlement</p>}
          {selectedNode.hasTrade && <p>🛒 Trading Post</p>}
          {selectedNode.id !== currentNodeId && (
            <button
              className={styles.plotButton}
              onClick={() => onPlotCourse?.(selectedNode.id)}
            >
              Plot Course
            </button>
          )}
          {selectedNode.id === currentNodeId && (
            <p className={styles.currentLocation}>📍 Current Location</p>
          )}
        </div>
      )}

      <div className={styles.mapControls}>
        <button onClick={() => setView({ zoom: 1, pan: { x: 0, y: 0 } })}>
          Reset View
        </button>
        <button onClick={() => setView((prev) => ({ ...prev, zoom: Math.min(3, prev.zoom * 1.2) }))}>
          Zoom In
        </button>
        <button onClick={() => setView((prev) => ({ ...prev, zoom: Math.max(0.5, prev.zoom / 1.2) }))}>
          Zoom Out
        </button>
      </div>
    </div>
  )
}

// Helper function to render the map
function renderMap(
  ctx: CanvasRenderingContext2D,
  graph: MapGraph,
  view: ViewTransform,
  state: {
    currentNodeId: string
    visitedNodeIds: string[]
    hoveredNode: string | null
    selectedNode: string | null
  }
): void {
  const { zoom, pan } = view

  // Clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // Save context
  ctx.save()

  // Apply transform
  ctx.translate(pan.x, pan.y)
  ctx.scale(zoom, zoom)

  // Draw parchment background
  ctx.fillStyle = '#f4e7d7'
  ctx.fillRect(0, 0, 1000, 800)

  // Add paper texture (simple noise)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * 1000
    const y = Math.random() * 800
    ctx.fillRect(x, y, 1, 1)
  }

  // Draw river segments
  graph.segments.forEach((segment) => {
    const fromNode = graph.nodes.find((n) => n.id === segment.fromNodeId)
    const toNode = graph.nodes.find((n) => n.id === segment.toNodeId)

    if (fromNode && toNode) {
      const isVisited =
        state.visitedNodeIds.includes(fromNode.id) &&
        state.visitedNodeIds.includes(toNode.id)

      drawRiverSegment(ctx, fromNode.coordinates, toNode.coordinates, isVisited)
    }
  })

  // Draw nodes
  graph.nodes.forEach((node) => {
    const isVisited = state.visitedNodeIds.includes(node.id)
    const isCurrent = node.id === state.currentNodeId
    const isHovered = node.id === state.hoveredNode
    const isSelected = node.id === state.selectedNode

    drawNode(ctx, node, {
      visited: isVisited,
      current: isCurrent,
      hovered: isHovered,
      selected: isSelected,
    })
  })

  // Restore context
  ctx.restore()
}

// Draw a river segment
function drawRiverSegment(
  ctx: CanvasRenderingContext2D,
  from: Vector2D,
  to: Vector2D,
  visited: boolean
): void {
  ctx.save()

  // River color
  ctx.strokeStyle = visited ? '#4a90e2' : '#a0a0a0'
  ctx.lineWidth = 12
  ctx.lineCap = 'round'

  // Draw main river
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.stroke()

  // Draw river banks (darker)
  ctx.strokeStyle = visited ? '#2d5f8d' : '#808080'
  ctx.lineWidth = 16
  ctx.globalAlpha = 0.5
  ctx.stroke()

  ctx.restore()
}

// Draw a node
function drawNode(
  ctx: CanvasRenderingContext2D,
  node: MapNode,
  state: {
    visited: boolean
    current: boolean
    hovered: boolean
    selected: boolean
  }
): void {
  const { x, y } = node.coordinates

  ctx.save()

  // Node circle
  const radius = state.current ? 12 : state.hovered || state.selected ? 10 : 8

  // Outer glow for current location
  if (state.current) {
    ctx.beginPath()
    ctx.arc(x, y, radius + 8, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(212, 175, 55, 0.3)'
    ctx.fill()
  }

  // Node background
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = state.visited ? '#d4af37' : '#c0c0c0'
  ctx.fill()

  // Node border
  ctx.strokeStyle = state.current
    ? '#ffd700'
    : state.selected
      ? '#d4af37'
      : state.hovered
        ? '#e0e0e0'
        : '#808080'
  ctx.lineWidth = state.hovered || state.selected ? 3 : 2
  ctx.stroke()

  // Draw settlement icon if present
  if (node.hasSettlement && state.visited) {
    ctx.fillStyle = '#ffffff'
    ctx.font = '16px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🏘️', x, y)
  }

  // Draw node label (only for visited or current)
  if (state.visited || state.current) {
    ctx.fillStyle = '#2d1810'
    ctx.font = 'bold 12px Georgia'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(node.name, x, y + radius + 5)
  }

  ctx.restore()
}

// Find node at position
function findNodeAtPosition(
  graph: MapGraph,
  x: number,
  y: number
): string | null {
  const hitRadius = 15

  for (const node of graph.nodes) {
    const dx = node.coordinates.x - x
    const dy = node.coordinates.y - y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= hitRadius) {
      return node.id
    }
  }

  return null
}
