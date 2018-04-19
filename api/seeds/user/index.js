const data = [
  {
    email: 'webviegas@gmail.com',
    username: 'gfviegas',
    name: 'Gustavo Viegas',
    password: 'secret',
    active: true,
    permissions: [
      {'resource': 'user', 'label': 'Usuários', 'value': ['view', 'manage']},
      {'resource': 'setup', 'label': 'Configurações', 'value': ['view', 'manage']},
      {'resource': 'bracket', 'label': 'Brackets', 'value': ['view', 'manage']}
    ]
  }
]

module.exports = data
