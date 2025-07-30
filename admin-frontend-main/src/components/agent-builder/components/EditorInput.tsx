import { EditorInputProps, MentionElement } from '@/types/agent-builder'
import { parseEditorValue } from '@/utils/botBuilder'
import React, {
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useState,
  ReactNode,
  forwardRef,
  useImperativeHandle,
} from 'react'
import ReactDOM from 'react-dom'
import { toast } from 'react-toastify'
import { Editor, Transforms, Range, createEditor, Node } from 'slate'
import {
  Slate,
  Editable,
  ReactEditor,
  withReact,
  useSelected,
  useFocused,
} from 'slate-react'

export const Portal = ({ children }: { children?: ReactNode }) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null
}

const EditorInput = forwardRef<ReactEditor, EditorInputProps>(
  (
    { characters, placeholder, value, onBlur, onChange, className, readOnly, checkMention },
    ref
  ) => {
    const portalRef = useRef<HTMLDivElement | null>(null)
    const [target, setTarget] = useState<Range | undefined | null>(null)
    const [index, setIndex] = useState<number>(0)
    const [search, setSearch] = useState<string>('')

    const editor = useMemo(() => withMentions(withReact(createEditor())), [])

    useImperativeHandle(ref, () => editor, [editor])

    const slateValue = useMemo(() => parseEditorValue(value), [value])

    const renderElement = useCallback(
      (props: any) => <Element {...props} />,
      []
    )
    const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [])

    const hasMention = useCallback((nodes: Node[]): boolean => {
      return nodes.some(node => {
        if (Node.isNode(node) && !Editor.isEditor(node)) {
          if ('type' in node && node.type === 'mention') {
            return true
          }
          if ('children' in node) {
            return hasMention(node.children as Node[])
          }
        }
        return false
      })
    }, [])

    const CHARACTERS = characters || []
    const chars = CHARACTERS.filter(c =>
      c.toLowerCase().startsWith(search.toLowerCase())
    ).slice(0, 10)

    const onKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        const editorHasMention = hasMention(editor.children)
        if (
          checkMention === true &&
          editorHasMention &&
          event.key !== 'Backspace' &&
          event.key !== 'Delete' &&
          !event.metaKey &&
          !event.ctrlKey
        ) {
          if (
            ![
              'ArrowLeft',
              'ArrowRight',
              'ArrowUp',
              'ArrowDown',
              'Tab',
              'Escape',
            ].includes(event.key)
          ) {
            event.preventDefault()
            toast.error('Only one field is allowed')
            return
          }
        }

        if (target && chars.length > 0) {
          switch (event.key) {
            case 'ArrowDown':
              event.preventDefault()
              setIndex(i => (i >= chars.length - 1 ? 0 : i + 1))
              break
            case 'ArrowUp':
              event.preventDefault()
              setIndex(i => (i <= 0 ? chars.length - 1 : i - 1))
              break
            case 'Tab':
            case 'Enter':
              event.preventDefault()
              insertMention(editor, chars[index])
              setTarget(null)
              break
            case 'Escape':
              event.preventDefault()
              setTarget(null)
              break
          }
        }
      },
      [chars, editor, index, target, hasMention]
    )

    useEffect(() => {
      if (target && chars.length > 0) {
        const el = portalRef.current
        if (!el) return
        const domRange = ReactEditor.toDOMRange(editor, target)
        const rect = domRange.getBoundingClientRect()
        el.style.top = `${rect.top + window.pageYOffset + 24}px`
        el.style.left = `${rect.left + window.pageXOffset}px`
      }
    }, [chars.length, editor, index, search, target])

    return (
      <div className={`pt-1 w-full rounded-md ${className || ''}`}>
        <Slate
          editor={editor}
          initialValue={slateValue}
          onChange={() => {
            const { selection } = editor
            const value = editor.children
            const content = JSON.stringify(editor.children)
            onChange && onChange(content)

            if (hasMention(value) && checkMention) {
              setTarget(null)
              return
            }

            if (selection && Range.isCollapsed(selection)) {
              const [start] = Range.edges(selection)

              const singleCharBefore = Editor.before(editor, start, {
                unit: checkMention ? 'word' : 'character',
              })
              const singleCharRange =
                singleCharBefore &&
                Editor.range(editor, singleCharBefore, start)
              const singleCharText =
                (singleCharRange && Editor.string(editor, singleCharRange)) ||
                ''

              const after = Editor.after(editor, start)
              const afterRange = Editor.range(editor, start, after)
              const afterText = Editor.string(editor, afterRange)
              const afterMatch = afterText.match(/^(\s|$)/)

              if (!afterMatch) {
                setTarget(null)
                return
              }
              if (singleCharText === '{') {
                const rangeToUse = singleCharRange
                if (!rangeToUse) {
                  setTarget(null)
                  return
                }

                setTarget(rangeToUse)
                setSearch('')

                setIndex(0)
                return
              }
            }

            setTarget(null)
          }}
        >
          <Editable
            renderElement={renderElement}
            readOnly={readOnly}
            renderLeaf={renderLeaf}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            placeholder={placeholder}
            className={`h-full text-md px-2 outline-none`}
          />

          {target && chars.length > 0 && (
            <Portal>
              <div
                ref={portalRef}
                className='absolute top-[-9999px] left-[-9999px] p-1 z-[9999999999] bg-white rounded'
                data-cy='mentions-portal'
              >
                {chars.map((char, i) => (
                  <div
                    key={char}
                    onClick={() => {
                      Transforms.select(editor, target)
                      insertMention(editor, char)
                      setTarget(null)
                    }}
                    className='p-1 rounded cursor-pointer'
                    style={{
                      background: i === index ? '#B4D5FF' : 'transparent',
                    }}
                  >
                    {char}
                  </div>
                ))}
              </div>
            </Portal>
          )}
        </Slate>
      </div>
    )
  }
)

const withMentions = (editor: any) => {
  const { isInline, isVoid, markableVoid } = editor

  editor.isInline = (element: any) => {
    return element.type === 'mention' ? true : isInline(element)
  }

  editor.isVoid = (element: any) => {
    return element.type === 'mention' ? true : isVoid(element)
  }

  editor.markableVoid = (element: any) => {
    return element.type === 'mention' || markableVoid(element)
  }

  return editor
}

const insertMention = (editor: any, character: string) => {
  const mention: MentionElement = {
    type: 'mention',
    character,
    children: [{ text: '' }],
  }

  if (editor.selection) {
    const [start] = Range.edges(editor.selection)
    const charBefore = Editor.before(editor, start, { unit: 'character' })
    if (charBefore) {
      const range = Editor.range(editor, charBefore, start)
      const text = Editor.string(editor, range)
      if (text === '{') {
        Transforms.delete(editor, { at: range })
      } else if (text.startsWith('{')) {
        const searchRange = Editor.range(
          editor,
          {
            path: range.anchor.path,
            offset: range.anchor.offset,
          },
          start
        )
        Transforms.delete(editor, { at: searchRange })
      }
    }
  }

  Transforms.insertNodes(editor, mention)
  Transforms.move(editor)
}

// --------------------------------------------------
// Rendering
// --------------------------------------------------
const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const Element = (props: any) => {
  const { attributes, children, element } = props
  switch (element.type) {
    case 'mention':
      return <Mention {...props} />
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Mention = ({ attributes, children, element }: any) => {
  const selected = useSelected()
  const focused = useFocused()
  const style: React.CSSProperties = {
    padding: '3px 3px 2px',
    margin: '0 1px',
    verticalAlign: 'baseline',
    display: 'inline-block',
    borderRadius: '4px',
    backgroundColor: '#eee',
    fontSize: '0.9em',
    boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
  }

  if (element.children[0].bold) {
    style.fontWeight = 'bold'
  }
  if (element.children[0].italic) {
    style.fontStyle = 'italic'
  }

  return (
    <span
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${element.character.replace(' ', '-')}`}
      style={style}
    >
      <span contentEditable={false}>
        {'{'}
        {element.character}
        {'}'}
      </span>
      {children}
    </span>
  )
}

export default EditorInput
