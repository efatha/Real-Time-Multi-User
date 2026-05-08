describe('Blog App', () => {
  it('should load login page', () => {
    cy.visit('/')
    cy.contains('Login').should('exist')
    cy.get('input[name="username"]').should('exist')
    cy.get('input[name="password"]').should('exist')
    cy.get('button[type="submit"]').should('exist')
  })

  it('should navigate to register page', () => {
    cy.visit('/')
    cy.contains('Register').click()
    cy.url().should('include', '/register')
    cy.contains('Register').should('exist')  // Check we're on register page
  })

  it('should register a new user', () => {
    cy.visit('/register')
    cy.get('input[name="username"]').type('testuser')
    cy.get('input[name="password"]').type('testpass')
    cy.get('button[type="submit"]').click()
    // Should redirect to login page
    cy.url().should('include', '/')
  })

  it('should login with registered user', () => {
    cy.visit('/')
    cy.get('input[name="username"]').type('testuser')
    cy.get('input[name="password"]').type('testpass')
    cy.get('button[type="submit"]').click()
    // Should redirect to home page
    cy.url().should('include', '/home')
    cy.contains('CommonBlog.com').should('exist')
  })
})