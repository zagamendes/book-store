/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import express from 'express'
import 'firebase-functions/logger/compat'
import cors from 'cors'
import mercadopago from 'mercadopago'
import { calcularPrecoPrazo } from 'correios-brasil'

const app = admin.initializeApp({ projectId: 'bookstore-15b7a' }, 'app')
const db = admin.firestore(app)
const server = express()

server.use(cors())

server.post('/create-session', async (req, res) => {
  mercadopago.configure({
    access_token:
      'TEST-3646656306065565-122917-d955faea3f1cbd56dd0acb568c213938-1275722752'
  })
  const { produtos, user, shippingPrice, shippingAddress } = req.body

  const arrayPromises = produtos.map(async (produto) => {
    return await db.collection('livros').doc(produto.id).get()
  })

  const arraySnapshot = await Promise.all(arrayPromises)

  const items = arraySnapshot.map((produto) => {
    const { quantidade } = produtos.find((currentProduto) => {
      if (currentProduto.id == produto.id) return true
      return false
    })

    return {
      id: produto.id,
      title: produto.data().nome,
      currency_id: 'BRL',
      picture_url: produto.data().foto,
      quantity: quantidade,
      unit_price: produto.data().preco
    }
  })
  console.log(items)

  try {
    const preference = {
      payer: {
        name: user.displayName.split(' ').shift(),
        surname: user.displayName.split(' ').pop(),
        email: user.email,
        date_created: Date.now(),
        address: {
          street_name: shippingAddress.logradouro,
          street_number: parseInt(shippingAddress.numero),
          zip_code: shippingAddress.cep
        },
        identification: {
          type: 'CPF',
          number: user.cpf
        }
      },
      items: [
        {
          id: 'item-ID-1234',
          title: 'Meu produto',
          currency_id: 'BRL',
          picture_url:
            'https://www.mercadopago.com/org-img/MP3/home/logomp3.gif',
          description: 'Descrição do Item',
          category_id: 'art',
          quantity: 1,
          unit_price: 100
        }
      ],
      back_urls: {
        success: `${process.env.BASE_URL}/orderPlaced`,
        failure: process.env.BASE_URL,
        pending: process.env.BASE_URL
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_methods: [
          {
            id: 'master'
          }
        ],
        excluded_payment_types: [
          {
            id: 'ticket'
          }
        ],

        installments: 12
      },

      statement_descriptor: 'livraria do izaac'
    }

    const settings = await mercadopago.preferences.create({
      items: [
        {
          id: 'item-ID-1234',
          title: 'Meu produto',
          currency_id: 'BRL',

          quantity: 1,
          unit_price: 75.76
        }
      ],
      payer: {
        name: 'João',
        surname: 'Silva',
        email: 'user@email.com',

        identification: {
          type: 'CPF',
          number: '19119119100'
        },
        address: {
          street_name: 'Street',
          street_number: 123,
          zip_code: '06233200'
        }
      },
      back_urls: {
        success: 'https://www.success.com',
        failure: 'http://www.failure.com',
        pending: 'http://www.pending.com'
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_methods: [
          {
            id: 'master'
          }
        ],
        excluded_payment_types: [
          {
            id: 'ticket'
          }
        ],
        installments: 12
      },
      notification_url: 'https://www.your-site.com/ipn',
      statement_descriptor: 'MEUNEGOCIO'
    })

    res.send(settings)
  } catch (e) {
    console.error(e)

    res.send({ error: e })
  }
})
server.post('/webhook', (req, res) => {
  res.status(200).send()
})
server.get('/livros/:termo', async (req, res) => {
  const termo = req.params.termo
  console.log('ssss')

  const documentData = await db
    .collection('livros')
    .where('palavras_para_busca', 'array-contains', termo)
    .get()
  const livros = [] as any
  documentData.forEach((livro) => {
    livros.push({ id: livro.id, ...livro.data() })
  })

  res.send(livros)
})
server.get('/calcularFrete/:cep', async (req, res) => {
  const { cep } = req.params

  const data = await calcularPrecoPrazo({
    sCepOrigem: '38408226',
    sCepDestino: cep as string,
    nCdServico: ['04014', '04510'],
    nCdFormato: '1',
    nVlPeso: '.5',
    nVlAltura: '7',
    nVlComprimento: '15',
    nVlLargura: '10',
    nVlDiametro: '0'
  })
  res.send(data)
})

export const api = functions.https.onRequest(server)
