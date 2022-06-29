

describe('GET /characters', function() {

    const characters = [
        {
             name: 'Chavier ',
             alias: 'professor',
             team: ['x-man'],
             active: true
         },
         {
              name: 'Logan ',
              alias: 'Wolverine',
              team: ['x-man'],
              active: true
         } ,
         {
              name: 'Peter',
              alias: 'Homem Aranha',
              team: ['vingadores'],
              active: true
          }  
    ]

     //Gancho do cypress para autorização do token / Commands
     before(function(){
        cy.back2ThePast()
        cy.setToken()
        cy.populateCharacters(characters)
     })

    it ('deve retornar uma lista de personagens', function() {

        cy.getCharacters().then(function(response) {
            expect(response.status).to.eql(200)
            expect(response.body).to.be.a('array')
            expect(response.body.length).greaterThan(0)
        })
    })

    it ('deve buscar personagens por nome', function() {

        cy.searchCharacters('Logan').then(function(response) {
            expect(response.status).to.eql(200)
            expect(response.body.length).to.eql(1)
            expect(response.body[0].alias).to.eql('Wolverine')
            expect(response.body[0].team).to.eql(['x-man'])
            expect(response.body[0].active).to.eql(true)
        })
    })
})


describe('GET /characters/id', function() {

     //Gancho do cypress para autorização do token / Commands
     before(function(){
        cy.back2ThePast()
        cy.setToken()
     })

   const tonyStark =  {
        name: 'Tony Stark',
        alias: 'Homem de ferro',
        team: ['Vingadores'],
        active: true
    }

    context('quando tenho um personagem cadastrado', function() {
       
        before(function() {
          
             cy.postCharacter(tonyStark).then(function(response) {
                 Cypress.env('characterId', response.body.character_id)
             })

        })

        it('deve buscar o personagem pelo id', function() {
            const id = Cypress.env('characterId')
            cy.getCharacterById(id).then(function(response) {
                expect(response.status).to.eql(200)
                expect(response.body.alias).to.eql('Homem de ferro')
                expect(response.body.team).to.eql(['Vingadores'])
                expect(response.body.active).to.eql(true)
            })
        })

    })

    it('deve retornar um 404 ao buscar um Id não cadastrado', function() {
        const id = '62bb9b47a1b99f31c50300a2'
        cy.getCharacterById(id).then(function(response) {
            expect(response.status).to.eql(404)
         })

    })

})