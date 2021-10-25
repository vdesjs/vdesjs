/**
 * 感谢 John Resig： https://johnresig.com/files/htmlparser.js
 */

// 正则声明
const doctypeReg = /^<!\s*doctype((?:\s+[\w:]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/i
const startTagReg = /^<([-A-Za-z0-9_]+)((?:\s+[-A-Za-z0-9_:@.]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/i
const endTagReg = /^<\/([-A-Za-z0-9_]+)[^>]*>/i
const attrReg = /([-A-Za-z0-9_:@.]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g

// 空元素 - https://www.w3.org/TR/html/syntax.html#void-elements
const voidMap = {};
['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'].forEach(n => voidMap[n] = true)

// 块级元素 - https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements#Elements
const blockMap = {};
['address', 'article', 'aside', 'blockquote', 'canvas', 'dd', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'li', 'main', 'nav', 'noscript', 'ol', 'output', 'p', 'pre', 'section', 'table', 'tfoot', 'ul', 'video'].forEach(n => blockMap[n] = true)

// 行内元素 - https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements#Elements
const inlineMap = {};
['a', 'abbr', 'acronym', 'b', 'bdo', 'big', 'br', 'button', 'cite', 'code', 'dfn', 'em', 'i', 'img', 'input', 'kbd', 'label', 'map', 'object', 'q', 'samp', 'script', 'select', 'small', 'span', 'strong', 'sub', 'sup', 'textarea', 'time', 'tt', 'var'].forEach(n => inlineMap[n] = true)

// 可能包含任意内容的元素 - https://www.w3.org/TR/html/syntax.html#raw-text
const rawTextMap = {};
['script', 'style'].forEach(n => rawTextMap[n] = true)

const longAttributeCache = {}
let seed = 0

/**
 * 分词
 */
function tokenize(content, handler) {
    const stack = []
    let last = content

    stack.last = function() {
        return this[this.length - 1]
    }

    while (content) {
        let isText = true

        if (!stack.last() || !rawTextMap[stack.last()]) {
            if (content.indexOf('<!--') === 0) {
                // comment
                const index = content.indexOf('-->')

                if (index >= 0) {
                    content = content.substring(index + 3)
                    if (handler.comment) handler.comment(content)
                    isText = false
                }
            } else if (content.indexOf('</') === 0) {
                // end tag
                const match = content.match(endTagReg)

                if (match) {
                    content = content.substring(match[0].length)
                    match[0].replace(endTagReg, parseEndTag)
                    isText = false
                }
            } else if (content.indexOf('<') === 0) {
                // start tag
                let match = content.match(startTagReg)

                if (match) {
                    content = content.substring(match[0].length)
                    match[0].replace(startTagReg, parseStartTag)
                    isText = false
                } else {
                    // 检测 doctype
                    match = content.match(doctypeReg)

                    if (match) {
                        content = content.substring(match[0].length)
                        isText = false
                    }
                }
            }

            if (isText) {
                const indexStart = content.indexOf('<')
                const indexEnd = content.indexOf('>')

                // 简单自动纠错，只有 <、只有 >、> 在 < 前面、< 和 > 中间没有内容
                let text = ''
                if (indexStart === -1 || indexStart >= 0 && indexEnd === -1 || indexStart > indexEnd || (indexEnd > indexStart && !content.substring(indexStart + 1, indexEnd).trim())) {
                    text = content.replace(/>/g, '&gt;').replace(/</g, '&lt;')
                    content = ''
                } else {
                    text = content.substring(0, indexStart)
                    content = content.substring(indexStart)
                }

                if (handler.text && text) handler.text(text)
            }
        } else {
            const execRes = (new RegExp(`</${stack.last()}[^>]*>`)).exec(content)

            if (execRes) {
                const text = content.substring(0, execRes.index)
                content = content.substring(execRes.index + execRes[0].length)

                text.replace(/<!--(.*?)-->/g, '')
                if (text && handler.text) handler.text(text)
            }

            parseEndTag('', stack.last())
        }

        if (content === last) throw new Error(`parse error: ${content}`)
        last = content
    }

    // 关闭栈内的标签
    parseEndTag()

    function parseStartTag(tag, tagName, rest, unary) {
        tagName = tagName.toLowerCase()
        unary = !!unary

        // 放宽规则，允许行内元素包含块级元素
        // if (blockMap[tagName]) {
        //     while (stack.last() && inlineMap[stack.last()]) {
        //         // 自动关闭栈内的行内元素
        //         parseEndTag('', stack.last())
        //     }
        // }

        unary = voidMap[tagName] || !!unary

        if (!unary) stack.push(tagName)

        if (handler.start) {
            const attrs = []

            try {
                rest.replace(attrReg, (all, $1, $2, $3, $4) => {
                    const value = $2 || $3 || $4

                    attrs.push({
                        name: $1,
                        value,
                    })
                })
            } catch (err) {
                // 某些安卓机遇到过长的字符串执行属性正则替换会跪（主要是 base 64），这里就先临时过滤掉这种特殊情况
                rest = rest.replace(/url\([^)]+\)/ig, all => {
                    const id = `url(:#|${++seed}|#:)`
                    longAttributeCache[id] = all
                    return id
                })
                rest.replace(attrReg, (all, $1, $2, $3, $4) => {
                    const value = $2 || $3 || $4

                    attrs.push({
                        name: $1,
                        value: value.replace(/url\(:#\|\d+\|#:\)/ig, all => longAttributeCache[all] || 'url()'),
                    })
                })
            }

            handler.start(tagName, attrs, unary)
        }
    }

    function parseEndTag(tag, tagName) {
        let pos

        if (!tagName) {
            pos = 0
        } else {
            // 找到同名的开始标签
            tagName = tagName.toLowerCase()

            for (pos = stack.length - 1; pos >= 0; pos--) {
                if (stack[pos] === tagName) break
            }
        }

        if (pos >= 0) {
            // 关闭开始标签和结束标签中的所有标签
            for (let i = stack.length - 1; i >= pos; i--) {
                if (handler.end) handler.end(stack[i])
            }

            stack.length = pos
        }
    }
}

export default {
    parse(html) {
        const r = {
            children: [],
        }
        const stack = [r]

        stack.last = function() {
            return this[this.length - 1]
        }

        tokenize(html, {
            start(tagName, attrs, unary) {
                const attrsMap = attrs.reduce((tempObj, item) => {
                    tempObj[item.name] = item.value
                    return tempObj
                }, {})
                const node = {
                    type: 'node',
                    name: tagName,
                    attrs: attrsMap,
                    children: [],
                }

                stack.last().children.push(node)

                if (!unary) {
                    stack.push(node)
                }
            },
            end() {
                stack.pop()
            },
            text(content) {
                // 此处不能做 trim，要保留完整的空格返回
                if (!content) return

                stack.last().children.push({
                    type: 'text',
                    text: content,
                })
            },
        })

        return r.children
    }
}
