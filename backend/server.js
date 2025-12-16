const jsonServer = require('json-server')
const auth = require('json-server-auth')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// قواعد الحماية
const rules = auth.rewriter({
  // حماية كل الـ routes المتعلقة بالـ posts للـ users المؤكدين فقط
  posts: 664, // يعني الـ users مؤكدين فقط يمكنهم القراءة والكتابة
  users: 664  // فقط المستخدم نفسه يمكنه الوصول لبياناته
})

server.db = router.db

server.use(middlewares)
server.use(rules)
server.use(auth)
server.use(router)

server.listen(8000, () => {
  console.log('JSON Server is running with auth on port 8000')
})