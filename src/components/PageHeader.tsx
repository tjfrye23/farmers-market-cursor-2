import React, { ReactNode } from 'react'

export interface PageHeaderProps {
  title: string
  description?: string
  image?: string
  overlay?: boolean
  children?: ReactNode
}

const PageHeader = ({
  title,
  description,
  image = '/images/products/farmer-field.jpeg',
  overlay = true,
  children,
}: PageHeaderProps) => {
  return (
    <div className="relative">
      <div
        className="h-72 bg-cover bg-center md:h-96"
        style={{ backgroundImage: `url(${image})` }}
      >
        {overlay && (
          <div className="bg-opacity-40 absolute inset-0 bg-black"></div>
        )}
        <div className="relative z-10 container mx-auto flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="font-display mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl text-lg text-white md:text-xl">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

export default PageHeader
