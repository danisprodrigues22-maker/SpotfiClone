/*



========================================
🧪 TESTES DA API – MINI SPOTIFY (POSTMAN)
========================================

BASE URL:
http://localhost:3000/api


========================================
👤 USERS
========================================

----------------------------------------
➕ CRIAR USUÁRIO
----------------------------------------
Método: POST
URL: /users

Body (JSON):
{
  "name": "Daniel",
  "email": "daniel@email.com",
  "password": "123456"
}

→ Copie o "_id" retornado
→ Use esse ID como:
  USER_ID


----------------------------------------
📄 LISTAR USUÁRIOS
----------------------------------------
Método: GET
URL: /users

Sem body


----------------------------------------
🔍 BUSCAR USUÁRIO POR ID
----------------------------------------
Método: GET
URL: /users/USER_ID

Sem body


========================================
🎵 SONGS
========================================

----------------------------------------
➕ CRIAR MÚSICA
----------------------------------------
Método: POST
URL: /songs

Body (JSON):
{
  "title": "Minha Música",
  "artist": "Artista Exemplo",
  "album": "Álbum X",
  "genre": "pop",
  "duration": 210,
  "audioUrl": "http://meuservidor/uploads/minha-musica.mp3",
  "createdBy": "USER_ID"
}

→ Copie o "_id" retornado
→ Use esse ID como:
  SONG_ID


----------------------------------------
📄 LISTAR MÚSICAS
----------------------------------------
Método: GET
URL: /songs

Sem body


----------------------------------------
🔍 BUSCAR MÚSICA POR ID
----------------------------------------
Método: GET
URL: /songs/SONG_ID

Sem body


----------------------------------------
✏️ ATUALIZAR MÚSICA
----------------------------------------
Método: PUT
URL: /songs/SONG_ID

Body (JSON):
{
  "title": "Minha Música Editada",
  "genre": "rock"
}

(Envie apenas os campos que quiser alterar)


----------------------------------------
❌ DELETAR MÚSICA
----------------------------------------
Método: DELETE
URL: /songs/SONG_ID

Sem body


========================================
🎶 PLAYLISTS
========================================

----------------------------------------
➕ CRIAR PLAYLIST
----------------------------------------
Método: POST
URL: /playlists

Body (JSON):
{
  "name": "Minhas Favoritas",
  "description": "Playlist de testes",
  "owner": "USER_ID",
  "isPublic": true
}

→ Copie o "_id" retornado
→ Use esse ID como:
  PLAYLIST_ID


----------------------------------------
📄 LISTAR PLAYLISTS
----------------------------------------
Método: GET
URL: /playlists

Sem body


----------------------------------------
🔍 BUSCAR PLAYLIST POR ID
----------------------------------------
Método: GET
URL: /playlists/PLAYLIST_ID

Sem body

→ Deve retornar:
- owner populado
- songs populadas


----------------------------------------
➕ ADICIONAR MÚSICA NA PLAYLIST
----------------------------------------
Método: POST
URL: /playlists/PLAYLIST_ID/songs

Body (JSON):
{
  "songId": "SONG_ID"
}


----------------------------------------
❌ REMOVER MÚSICA DA PLAYLIST
----------------------------------------
Método: DELETE
URL: /playlists/PLAYLIST_ID/songs/SONG_ID

Sem body


----------------------------------------
🗑️ DELETAR PLAYLIST
----------------------------------------
Método: DELETE
URL: /playlists/PLAYLIST_ID

Sem body


========================================
✅ ORDEM RECOMENDADA DE TESTES
========================================

1) POST   /users
2) POST   /songs
3) GET    /songs
4) POST   /playlists
5) POST   /playlists/PLAYLIST_ID/songs
6) GET    /playlists/PLAYLIST_ID

========================================
📌 OBSERVAÇÕES IMPORTANTES
========================================

- USER_ID → vem da collection users
- SONG_ID → vem da collection songs
- PLAYLIST_ID → vem da collection playlists
- IDs sempre são "_id" retornados pelo MongoDB
- GET nunca precisa de body
- POST e PUT sempre usam Body → raw → JSON no Postman

========================================
FIM DO MANUAL DE TESTES
========================================




*/