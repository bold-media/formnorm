import { cn } from '@/utils/cn'

interface ProgressBarProps extends React.ComponentPropsWithoutRef<'div'> {
  progress: number
}

export const ProgressBar = ({ progress, className }: ProgressBarProps) => {
  return (
    <div className="h-1 relative">
      <div className="absolute top-0 bottom-0 left-0 w-full h-full bg-gray-200 rounded-full"></div>
      <div
        style={{
          width: `${progress}%`,
        }}
        className={cn(
          'absolute top-0 bottom-0 left-0 h-full transition-all duration-150 bg-purple-500 rounded-full',
          className,
        )}
      ></div>
      <div className="absolute top-0 bottom-0 left-0 flex items-center justify-center w-full h-full"></div>
    </div>
  )
}

ProgressBar.displayName = 'ProgressBar'
