'use client'

import {
  cloneElement,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useState,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'
import { cx } from '@/lib/cx'

type TransitionClasses = {
  enterActiveClass?: string
  enterFromClass?: string
  enterToClass?: string
  leaveActiveClass?: string
  leaveFromClass?: string
  leaveToClass?: string
}

type TransitionProps = TransitionClasses & {
  mode?: 'out-in'
  children?: ReactNode
}

type ChildElement = ReactElement<{ className?: string, ref?: Ref<HTMLElement> }>

type Entry = {
  id: number
  element: ChildElement
  stage: 'entering' | 'entered' | 'leaving'
}

type TransitionState = {
  child: ChildElement | null
  current: Entry | null
  leaving: Entry | null
  pending: { element: ChildElement | null } | null
  nextId: number
}

type Phase = 'enter-from' | 'enter-to' | 'idle' | 'leave-from' | 'leave-to'

const isSameChild = (a: ChildElement | null, b: ChildElement | null) =>
  a !== null && b !== null && a.type === b.type && a.key === b.key

const toChildElement = (children: ReactNode) =>
  isValidElement(children) ? children as ChildElement : null

const reconcile = (state: TransitionState, child: ChildElement | null, mode: TransitionProps['mode']): TransitionState => {
  const next = { ...state, child }

  if (state.pending) {
    return { ...next, pending: { element: child } }
  }

  if (state.current && isSameChild(state.current.element, child)) {
    return { ...next, current: { ...state.current, element: child! } }
  }

  if (!state.current && !child) {
    return next
  }

  const leaving = state.current ? { ...state.current, stage: 'leaving' as const } : null

  if (mode === 'out-in' && leaving) {
    return { ...next, current: null, leaving, pending: { element: child } }
  }

  const keptLeaving = leaving ?? (isSameChild(state.leaving?.element ?? null, child) ? null : state.leaving)

  return {
    ...next,
    current: child ? { id: state.nextId, element: child, stage: 'entering' } : null,
    leaving: keptLeaving,
    nextId: state.nextId + 1,
  }
}

const nextFrame = (callback: () => void) => {
  let innerFrame = 0
  const outerFrame = requestAnimationFrame(() => {
    innerFrame = requestAnimationFrame(callback)
  })

  return () => {
    cancelAnimationFrame(outerFrame)
    cancelAnimationFrame(innerFrame)
  }
}

const toMs = (value: string) => (value === 'auto' ? 0 : Number(value.slice(0, -1).replace(',', '.')) * 1000)

const getTimeout = (delays: string[], durations: string[]): number => {
  while (delays.length < durations.length) {
    delays = delays.concat(delays)
  }

  return Math.max(...durations.map((duration, index) => toMs(duration) + toMs(delays[index] ?? '0s')))
}

const getTransitionInfo = (element: Element) => {
  const styles = window.getComputedStyle(element)
  const read = (property: string) => (styles.getPropertyValue(property) || '').split(', ')
  const transitionDurations = read('transition-duration')
  const animationDurations = read('animation-duration')
  const transitionTimeout = getTimeout(read('transition-delay'), transitionDurations)
  const animationTimeout = getTimeout(read('animation-delay'), animationDurations)
  const timeout = Math.max(transitionTimeout, animationTimeout)
  const type = timeout > 0 ? (transitionTimeout > animationTimeout ? 'transition' : 'animation') : null
  const propCount = type === 'transition' ? transitionDurations.length : type === 'animation' ? animationDurations.length : 0

  return { type, timeout, propCount }
}

const whenTransitionEnds = (element: HTMLElement, resolve: () => void) => {
  const { type, timeout, propCount } = getTransitionInfo(element)

  if (!type) {
    resolve()
    return () => {}
  }

  const endEvent = `${type}end`
  let ended = 0

  const cleanup = () => {
    element.removeEventListener(endEvent, onEnd)
    window.clearTimeout(timer)
  }
  const end = () => {
    cleanup()
    resolve()
  }
  const onEnd = (event: Event) => {
    if (event.target === element && ++ended >= propCount) {
      end()
    }
  }
  const timer = window.setTimeout(() => {
    if (ended < propCount) {
      end()
    }
  }, timeout + 1)

  element.addEventListener(endEvent, onEnd)
  return cleanup
}

const getInitialPhase = (stage: Entry['stage']): Phase =>
  stage === 'entering' ? 'enter-from' : stage === 'leaving' ? 'leave-from' : 'idle'

function TransitionItem({
  entry,
  classes,
  onDone,
}: {
  entry: Entry
  classes: TransitionClasses
  onDone: (id: number, stage: Entry['stage']) => void
}) {
  const [element, setElement] = useState<HTMLElement | null>(null)
  const [stage, setStage] = useState(entry.stage)
  const [phase, setPhase] = useState<Phase>(() => getInitialPhase(entry.stage))

  if (entry.stage !== stage) {
    setStage(entry.stage)
    setPhase(getInitialPhase(entry.stage))
  }

  const { id } = entry

  useLayoutEffect(() => {
    if (!element || phase === 'idle') {
      return
    }

    if (phase === 'enter-from' || phase === 'leave-from') {
      return nextFrame(() => setPhase(phase === 'enter-from' ? 'enter-to' : 'leave-to'))
    }

    return whenTransitionEnds(element, () => {
      if (phase === 'enter-to') {
        setPhase('idle')
      }

      onDone(id, stage)
    })
  }, [element, phase, id, stage, onDone])

  const phaseClassName = {
    'enter-from': cx(classes.enterFromClass, classes.enterActiveClass),
    'enter-to': cx(classes.enterActiveClass, classes.enterToClass),
    'idle': '',
    'leave-from': cx(classes.leaveFromClass, classes.leaveActiveClass),
    'leave-to': cx(classes.leaveActiveClass, classes.leaveToClass),
  }[phase]

  return cloneElement(entry.element, {
    ref: setElement,
    className: cx(entry.element.props.className, phaseClassName) || undefined,
  })
}

export default function Transition({ mode, children, ...classes }: TransitionProps) {
  const child = toChildElement(children)
  const [state, setState] = useState<TransitionState>(() => ({
    child,
    current: child ? { id: 0, element: child, stage: 'entered' } : null,
    leaving: null,
    pending: null,
    nextId: 1,
  }))

  if (child !== state.child) {
    setState(reconcile(state, child, mode))
  }

  const handleDone = useCallback((id: number, stage: Entry['stage']) => {
    setState((previous) => {
      if (stage === 'entering') {
        return previous.current?.id === id
          ? { ...previous, current: { ...previous.current, stage: 'entered' } }
          : previous
      }

      if (stage !== 'leaving' || previous.leaving?.id !== id) {
        return previous
      }

      if (!previous.pending) {
        return { ...previous, leaving: null }
      }

      const element = previous.pending.element

      return {
        ...previous,
        leaving: null,
        pending: null,
        current: element ? { id: previous.nextId, element, stage: 'entering' } : null,
        nextId: previous.nextId + 1,
      }
    })
  }, [])

  return (
    <>
      {[state.leaving, state.current].map((entry) => entry && (
        <TransitionItem key={entry.id} entry={entry} classes={classes} onDone={handleDone} />
      ))}
    </>
  )
}
