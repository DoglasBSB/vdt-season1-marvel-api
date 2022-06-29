

describe ('POST /characters', function(){

    //Gancho do cypress para autorização do token / Commands
    before (function(){
       cy.back2ThePast()
       cy.setToken()
    })

    
     it ('deve cadastrar um personagem', function(){

         const character = {
                name: 'Wanda Maximoff',
                alias: 'Feiticeira Escarlate',
                team: ['vingadores'],
                active: true
        }  

        cy.postCharacter(character)
        .then(function(response){
            expect(response.status).to.eql(201)
            cy.log(response.body.character_id)
            //Validando o ID do MongoDB com a propriedade Length
            expect(response.body.character_id.length).to.eql(24)
             
            
        })
    })

    // Campos obrigatorios
    it('o campo name deve ser obrigatório', function () {
        const character = {
            alias: 'Ciclope',
            team: ['x-men'],
            active: true
        }

        cy.postCharacter(character)
            .then(function (response) {
                expect(response.status).to.eql(400)
                expect(response.body.validation.body.message).to.eql('\"name\" is required')
            })

    })

    it('o campo alias deve ser obrigatório', function () {
        const character = {
            name: 'Ciclope',
            team: ['x-men'],
            active: true
        }

        cy.postCharacter(character)
            .then(function (response) {
                expect(response.status).to.eql(400)
                expect(response.body.validation.body.message).to.eql('\"alias\" is required')
            })

    })

    it('o campo team deve ser obrigatório', function () {
        const character = {
            name: 'Ciclope',
            alias: 'Scott Summers',
            active: true
        }

        cy.postCharacter(character)
            .then(function (response) {
                expect(response.status).to.eql(400)
                expect(response.body.validation.body.message).to.eql('\"team\" is required')
            })

    })

    it('o campo active deve ser obrigatório', function () {
        const character = {
            name: 'Anna Marie',
            alias: 'Vampira',
            team: ['x-men'],
        }

        cy.postCharacter(character)
            .then(function (response) {
                expect(response.status).to.eql(400)
                expect(response.body.validation.body.message).to.eql('\"active\" is required')
            })

    })

    // context.only "only" - roda apenas esse contexto
    context('quando o personagem já existe', function(){

        const character = {
            name: 'Pietro Maximoff',
            alias: 'Mercurio',
            team: ['Vingadores da costa do oeste'],
            active: true
        }
       

         before(function(){
            cy.postCharacter(character).then(function(response){
                expect(response.status).to.eql(201)
               
                                   
            })
         })

         it('não deve cadastrar duplicado', function() {

            cy.postCharacter(character).then(function(response){
                expect(response.status).to.eql(400)
                expect(response.body.error).to.eql('Duplicate character')                    
            })

         })
    })
})

