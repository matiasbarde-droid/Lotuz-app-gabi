import React from 'react'
import { vi, describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Mock hooks
vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ user: null, isAdmin: () => false })
}))
vi.mock('../../../context/CartContext', () => ({
  useCart: () => ({ cartItems: [{ sku: 'x', nombre: 'Item', cantidad: 1, precio: 1000 }], getCartTotal: () => 1000, checkout: vi.fn(), clearCart: vi.fn() })
}))

import Checkout from '../Checkout.jsx'

describe('Checkout email field', () => {
  it('shows empty and enabled when no session', () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    )
    const emailInput = screen.getByLabelText('Email')
    expect(emailInput != null).toBe(true)
    expect(emailInput.value).toBe('')
    expect(emailInput.disabled).toBe(false)
  })
})

describe('Checkout email field with session', () => {
  it('prefills and disables when user logged', async () => {
    vi.resetModules()
    vi.doMock('../../../context/AuthContext', () => ({
      useAuth: () => ({ user: { correo: 'cliente@correo.cl', nombre: 'Cliente' }, isAdmin: () => false })
    }))
    vi.doMock('../../../context/CartContext', () => ({
      useCart: () => ({ cartItems: [{ sku: 'x', nombre: 'Item', cantidad: 1, precio: 1000 }], getCartTotal: () => 1000, checkout: vi.fn(), clearCart: vi.fn() })
    }))
    const Comp = (await import('../Checkout.jsx')).default
    render(
      <MemoryRouter>
        <Comp />
      </MemoryRouter>
    )
    const emailInput = screen.getByLabelText('Email')
    expect(emailInput.value).toBe('cliente@correo.cl')
    expect(emailInput.disabled).toBe(true)
  })
})
