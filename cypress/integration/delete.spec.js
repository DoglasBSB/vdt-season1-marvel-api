
describe('DELETE /characters/id', function() {

    //Gancho do cypress para autorização do token / Commands
    before(function(){
       cy.back2ThePast()
       cy.setToken()
    })

  const tochaHumana =  {
       name: 'Jhonny Storm St',
       alias: 'Tocha Humana',
       team: ['Quarteto Fantastico'],
       active: true
   }

   context('quando tenho um personagem cadastrado', function() {
      
    //Criar massa
       before(function() {
            cy.postCharacter(tochaHumana).then(function(response) {
                Cypress.env('characterId', response.body.character_id)
            })

       })
       // Alvo do test
       it('deve remover o personagem pelo id', function() {
           const id = Cypress.env('characterId')
           cy.deleteCharacterById(id).then(function(response) {
               expect(response.status).to.eql(204)
              // Não tem conteúdo para validar!
           })
       })

       //Garante que a exclusão aconteceu com sucesso!
       after(function() {
        const id = Cypress.env('characterId')
        cy.getCharacterById(id).then(function(response) {
           expect(response.status).to.eql(404)
             })
       })

   })
        
         it('deve retornar 404 ao remover por Id não cadastrado', function() {
              const id = '62bb9b47a1b99f31c50300a2'
               cy.deleteCharacterById(id).then(function(response) {
                 expect(response.status).to.eql(404)
        })

   })

})