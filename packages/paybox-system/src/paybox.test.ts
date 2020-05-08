import { Paybox } from './paybox'
import axios from 'axios'

beforeEach(() => {
  jest.resetAllMocks()
})

test('should get an error from the provided code', () => {
  let error = Paybox.getError('00100')
  expect(error).toBe('Paiement refusé par le centre d’autorisation')

  error = Paybox.getError('00021')
  expect(error).toBe('Carte non autorisée')

  error = Paybox.getError('0123131')
  expect(error).toBe('Erreur 0123131')
})

test('should get the validity status of a payment result', () => {
  const signatureIsValid = jest.spyOn(Paybox, 'signatureIsValid').mockImplementation(() => true)

  let status = Paybox.isValid(<any>{}, 5000)
  expect(status).toBe(false)

  status = Paybox.isValid(<any>{ authorizationId: '1234', error: '00123' }, 5000)
  expect(status).toBe(false)

  status = Paybox.isValid(<any>{ authorizationId: '1234', error: '00000', amount: '1234' }, 5000)
  expect(status).toBe(false)

  status = Paybox.isValid(<any>{ authorizationId: '1234', error: '00000', amount: '5000' }, 5000)
  expect(status).toBe(true)
  expect(signatureIsValid).toHaveBeenCalledTimes(1)
})

test('should get a valid sandbox paybox form', async () => {
  let get = jest.spyOn(axios, 'get').mockImplementation(async () => ({ data: '>OK<' }))

  const paybox = Paybox.create({
    payboxSandbox: true,
    payboxSite: '1999888',
    payboxRang: '32',
    payboxIdentifiant: '1686319',
    payboxHmac: 'HMACHMACHMAC',
    payboxEffectue: 'https://www.exemple.com/payment/success',
    payboxRefuse: 'https://www.exemple.com/payment/error',
    payboxAnnule: 'https://www.exemple.com/payment/cancelled',
    payboxAttente: 'https://www.exemple.com/payment/waiting',
    payboxRepondreA: 'https://www.exemple.com/payment/process',
    amount: 50,
    email: 'adrian@example.com',
    reference: '123456',
  })

  let form = await paybox.form()

  expect(get).toHaveBeenCalledTimes(1)
  expect(form.url).toBe('https://preprod-tpeweb.paybox.com/cgi/MYchoix_pagepaiement.cgi')
  expect(form.method).toBe('POST')
  expect(form.form).toBeTruthy()
  expect(form.elements).toBeTruthy()

  get = jest.spyOn(axios, 'get').mockImplementation(async () => ({ data: '>NOK<' }))

  form = await paybox.form()

  expect(form.url).toBe('https://preprod-tpeweb.paybox.com/cgi/MYchoix_pagepaiement.cgi')
})

test('should get a valid production paybox form', async () => {
  let get = jest.spyOn(axios, 'get').mockImplementation(async () => ({ data: '>OK<' }))

  const paybox = Paybox.create({
    payboxSandbox: false,
    payboxSite: '1999888',
    payboxRang: '32',
    payboxIdentifiant: '1686319',
    payboxHmac: 'HMACHMACHMAC',
    payboxEffectue: 'https://www.exemple.com/payment/success',
    payboxRefuse: 'https://www.exemple.com/payment/error',
    payboxAnnule: 'https://www.exemple.com/payment/cancelled',
    payboxAttente: 'https://www.exemple.com/payment/waiting',
    payboxRepondreA: 'https://www.exemple.com/payment/process',
    amount: 50,
    email: 'adrian@example.com',
    reference: '123456',
  })

  let form = await paybox.form()

  expect(get).toHaveBeenCalledTimes(1)
  expect(form.url).toBe('https://tpeweb.paybox.com/cgi/MYchoix_pagepaiement.cgi')
  expect(form.method).toBe('POST')
  expect(form.form).toBeTruthy()
  expect(form.elements).toBeTruthy()

  get = jest.spyOn(axios, 'get').mockImplementation(async () => ({ data: '>NOK<' }))

  form = await paybox.form()

  expect(form.url).toBe('https://tpeweb1.paybox.com/cgi/MYchoix_pagepaiement.cgi')
})

test('should create a paybox payment', () => {
  const email = 'adrian@example.com'

  const paybox = Paybox.create({
    payboxSandbox: true,
    payboxSite: '1999888',
    payboxRang: '32',
    payboxIdentifiant: '1686319',
    payboxHmac: 'HMACHMACHMAC',
    payboxEffectue: 'https://www.exemple.com/payment/success',
    payboxRefuse: 'https://www.exemple.com/payment/error',
    payboxAnnule: 'https://www.exemple.com/payment/cancelled',
    payboxAttente: 'https://www.exemple.com/payment/waiting',
    payboxRepondreA: 'https://www.exemple.com/payment/process',
    amount: 50,
    email,
    reference: '123456',
  })

  expect(paybox.sandbox).toBe(true)
  expect(paybox.request.PBX_TOTAL).toBe('0000005000')
  expect(paybox.request.PBX_DEVISE).toBe('978')
  expect(paybox.request.PBX_PORTEUR).toBe(email)
  expect(paybox.request.PBX_RUF1).toBe('POST')
  expect(paybox.request.PBX_HASH).toBe('SHA512')
  expect(paybox.request.PBX_EFFECTUE).toBe('https://www.exemple.com/payment/success')
  expect(paybox.request.PBX_REFUSE).toBe('https://www.exemple.com/payment/error')
  expect(paybox.request.PBX_ANNULE).toBe('https://www.exemple.com/payment/cancelled')
  expect(paybox.request.PBX_ATTENTE).toBe('https://www.exemple.com/payment/waiting')
  expect(paybox.request.PBX_REPONDRE_A).toBe('https://www.exemple.com/payment/process')
})
