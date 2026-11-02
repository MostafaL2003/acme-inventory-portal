import { useEffect } from 'react'
import { useAppDispatch } from '@/shared/hooks'
import { toggleCommandPalette } from '@/shared/store'

export function useCommandPaletteShortcut(): void {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        dispatch(toggleCommandPalette())
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return (): void => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [dispatch])
}

export default useCommandPaletteShortcut
