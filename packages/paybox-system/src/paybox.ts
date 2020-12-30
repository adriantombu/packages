import querystring from 'querystring'
import axios from 'axios'
import crypto from 'crypto'

import errors from './errors'
import { Document, Params, Request, Result, FormElement } from './types'

export * from './types'

export class Paybox implements Document {
  request: Request
  sandbox: boolean

  constructor(params: Params) {
    this.sandbox = params.payboxSandbox

    this.request = {
      PBX_SITE: params.payboxSite,
      PBX_RANG: params.payboxRang,
      PBX_IDENTIFIANT: params.payboxIdentifiant,
      PBX_ARCHIVAGE: this.archivage(),
      PBX_HMAC: params.payboxHmac,

      PBX_TOTAL: this.formatAmount(params.amount),
      PBX_DEVISE: '978',

      PBX_CMD: params.reference,
      PBX_PORTEUR: params.email,
      PBX_RETOUR: this.setReturnVars(),
      PBX_RUF1: 'POST',

      PBX_TIME: this.getTime(),
      PBX_HASH: 'SHA512',

      PBX_EFFECTUE: params.payboxEffectue,
      PBX_REFUSE: params.payboxRefuse,
      PBX_ANNULE: params.payboxAnnule,
      PBX_ATTENTE: params.payboxAttente,
      PBX_REPONDRE_A: params.payboxRepondreA,
    }

    this.computeHMAC()
  }

  static create(params: Params) {
    return new Paybox(params)
  }

  static getError(code: string): string {
    if (code.startsWith('001')) {
      return 'Paiement refusé par le centre d’autorisation'
    }

    if (code in errors) {
      return errors[code]
    }

    return `Erreur ${code}`
  }

  static isValid(result: Result, amount: number): boolean {
    return (
      !!result.authorizationId &&
      result.error === '00000' &&
      Number.parseInt(result.amount, 10) === amount &&
      this.signatureIsValid(result)
    )
  }

  static signatureIsValid(result: Result): boolean {
    const signature = new Buffer(result.signature, 'base64')
    delete result.signature

    if (signature.length !== 128) {
      return false
    }

    const message = querystring.stringify(result as any)
    const publicKey = crypto.createPublicKey(payboxPublicKey)

    return crypto.createVerify('SHA1').update(message).verify(publicKey, signature)
  }

  async form() {
    return {
      url: await this.getUrl(),
      method: this.request.PBX_RUF1,
      form: this.getFormElements()
        .map((e) => `<input type="hidden" name="${e.name}" value="${e.value}" />`)
        .join(''),
      elements: this.getFormElements(),
    }
  }

  private archivage(): string {
    return Date.now().toString().substr(-12)
  }

  private formatAmount(amount: number | string): string {
    return `${parseInt(amount.toString(), 10) * 100}`.padStart(10, '0')
  }

  private setReturnVars(): string {
    let vars = ''

    for (const key of Object.keys(returnVars)) {
      vars += `${returnVars[key]}:${key};`
    }

    return vars
  }

  private getTime() {
    const now = new Date()
    const day = now.getDay().toString().padStart(2, '0')
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const year = now.getFullYear()
    const hour = now.getHours().toString().padStart(2, '0')
    const minute = now.getMinutes().toString().padStart(2, '0')
    const second = now.getSeconds().toString().padStart(2, '0')

    return `${day}${month}${year}${hour}${minute}${second}`
  }

  private computeHMAC() {
    if (this.request.PBX_HMAC) {
      const elements = this.getFormElements()
      const hmac = Buffer.from(this.request.PBX_HMAC, 'hex')
      const chain = elements.filter(e => e.name !== 'PBX_HMAC').map((e) => `${e.name}=${e.value}`).join('&')

      this.request.PBX_HMAC = crypto.createHmac('sha512', hmac).update(chain).digest('hex').toUpperCase()
    }
  }

  private async getUrl(): Promise<string> {
    const urls = this.sandbox ? baseUrls.sandbox : baseUrls.prod
    const res = await axios.get(`${urls.main}/load.html`)

    return `${res.data.includes('>OK<') ? urls.main : urls.fallback}/cgi/MYchoix_pagepaiement.cgi`
  }

  private getFormElements() {
    const elements: FormElement[] = []

    for (const key of Object.keys(this.request)) {
      elements.push({
        name: key,
        value: (this.request as any)[key],
      })
    }

    return elements
  }
}

const returnVars = <{ [index: string]: string }>{
  M: 'amount',
  R: 'paymentId',
  T: 'transactionId',
  A: 'authorizationId',
  P: 'cardType',
  N: 'cardNumber',
  D: 'cardExpiration',
  E: 'error',
  S: 'payboxRef',
  K: 'signature',
}

const baseUrls = {
  prod: {
    main: 'https://tpeweb.paybox.com',
    fallback: 'https://tpeweb1.paybox.com',
  },
  sandbox: {
    main: 'https://preprod-tpeweb.paybox.com',
    fallback: 'https://preprod-tpeweb.paybox.com',
  },
}

const payboxPublicKey =
  '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDe+hkicNP7ROHUssGNtHwiT2Ew\nHFrSk/qwrcq8v5metRtTTFPE/nmzSkRnTs3GMpi57rBdxBBJW5W9cpNyGUh0jNXc\nVrOSClpD5Ri2hER/GcNrxVRP7RlWOqB1C03q4QYmwjHZ+zlM4OUhCCAtSWflB4wC\nKa1g88CjFwRw/PB9kwIDAQAB\n-----END PUBLIC KEY-----'
