import * as esprima from 'esprima'
import * as acornWalk from 'acorn-walk'

const blacklist = new Set(['eval', 'setTimeout', 'setInterval', 'fetch', 'Image', 'XMLHttpRequest', 'ActiveXObject'])

function hasBlacklist(node) {
  if (node.type === 'Identifier') {
    if (blacklist.has(node.name)) {
      return true
    }
  }
  return false
}

export function validateCode(code) {
  const ast = esprima.parse(code)
  console.log('ast --->>>', ast)

  let hasWindow = false
  let hasDocument = false
  let hasReturn = false

  acornWalk.simple(ast, {
    MemberExpression(node) {
      if (node.object.name === 'window') {
        hasWindow = true
      } else if (node.object.name === 'document') {
        hasDocument = true
      }
    },

    CallExpression(node) {
      if (hasBlacklist(node.callee)) {
        throw new Error(`存在不允许的 API 调用：${node.callee.name}，请修改`)
      }
    },

    ReturnStatement(node) {
      hasReturn = true
    }
  })

  if (hasWindow || hasDocument) {
    throw new Error('不能使用 window 或 document 关键字')
  }

  if (!hasReturn) {
    throw new Error('要求转换函数体必须包含 return 语句')
  }
  return hasReturn
}
