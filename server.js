import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


const app = express()
app.use(express.json())

const users = []

app.post('/usuarios', async (req, res) => {
    try {
      // Verifica se o email já está em uso
      const existingUser = await prisma.user.findUnique({
        where: { email: req.body.email }
      });
  
      if (existingUser) {
        // Responde com erro caso o email já esteja cadastrado
        return res.status(409).json({ error: 'O email já está em uso. Por favor, escolha outro.' });
      }
  
      // Se o email for único, cria o novo usuário
      const newUser = await prisma.user.create({
        data: {
          email: req.body.email,
          name: req.body.name,
          age: req.body.age
        }
      });
  
      res.status(201).json(newUser);
  
    } catch (error) {
      // Tratamento de erro genérico
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ error: 'Erro ao criar usuário. Tente novamente mais tarde.' });
    }
  });
  

app.get('/usuarios', async (req, res) => {
    let users = []

    if (req.query) {
        users = await prisma.user.findMany({
            where: {
                name: req.query.name,
                email: req.query.email,
                age: req.query.age
            }
        })
    } else {
        users = await prisma.user.findMany()
    }

    res.status(200).json(users)
})

app.put('/usuarios/:id', async (req, res) => {

    await prisma.user.update({
        where: {
            id: req.params.id
        },
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }

    })

    res.status(201).json(req.body)
})

app.delete('/usuarios/:id', async (req, res) => {
    await prisma.user.delete({
        where: {
            id: req.params.id
        },
    })

    res.status(200).json({ message: 'Usuário deletado com Sucesso!' })
})

app.listen(3000)


// Criar nossa API de usuários

// Criar um usuário
// Listar todos os usuários
// Editar um usuário
// Deletar um usuário


/*

   Usuário: victor
   Senha: UXNbhgh1BgHucxkJ

   1) Tipo de Rota / Método HTTP
   2) Endereço

*/ 