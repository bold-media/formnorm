import { LexicalNode } from '@payloadcms/richtext-lexical/lexical'

type BlockTransform<T, R> = (block: T) => R

interface BlockWithId {
  id?: string | null
  blockType?: string
  [key: string]: any
}

interface FindBlockParams<T extends BlockWithId, R = T> {
  richText: {
    root: {
      children: LexicalNode[]
      [key: string]: any
    }
    [key: string]: any
  }
  targetId: string
  path?: string[] // Path to the ID, e.g. ['rows', 'id'] for block.rows[0].id
  transform?: BlockTransform<T, R>
}

function isBlockNode(node: LexicalNode): node is LexicalNode & { type: string; fields: any } {
  return 'type' in node && 'fields' in node
}

/**
 * Recursively searches through a rich text tree to find a block with a matching ID
 * @param params - Object containing search parameters
 * @param params.richText - The rich text tree to search through
 * @param params.targetId - The ID to search for
 * @param params.path - Optional path to the ID within the block (e.g. ['rows', 'id'])
 * @param params.transform - Optional function to transform the found block
 * @returns The found block or transformed result
 */
export function findBlockById<T extends BlockWithId, R = T>({
  richText,
  targetId,
  path,
  transform,
}: FindBlockParams<T, R>): R | null {
  if (!richText?.root?.children) {
    return null
  }

  function findIdInBlock(block: T): boolean {
    // If no path is provided, check the block's direct ID
    if (!path) {
      return block.id === targetId
    }

    // If path is provided, traverse to the specific location
    let current: any = block
    for (const key of path) {
      if (Array.isArray(current)) {
        // If we're at an array, check all items
        return current.some((item) => item[key] === targetId)
      }
      current = current[key]
      if (!current) return false
    }
    return current === targetId
  }

  function traverseNodes(nodes: LexicalNode[]): R | null {
    for (const node of nodes) {
      // Check if this node is a block
      if (isBlockNode(node) && node.type === 'block') {
        const block = node.fields as unknown as T

        // Check if this block contains our target ID
        if (findIdInBlock(block)) {
          // If a transform is provided, return its result
          if (transform) {
            return transform(block)
          }

          return block as unknown as R
        }
      }

      // Recursively check children if they exist
      if ('children' in node && Array.isArray(node.children)) {
        const found = traverseNodes(node.children)
        if (found !== null) {
          return found
        }
      }
    }

    return null
  }

  return traverseNodes(richText.root.children)
}

// Example usage:
// // Find by block ID
// const table = findBlockById<TableBlockType>({
//   richText: article,
//   targetId: 'block-id-here'
// })

// // Find by nested ID (e.g. row ID)
// const table = findBlockById<TableBlockType>({
//   richText: article,
//   targetId: 'row-id-here',
//   path: ['rows', 'id']
// })

// // With condition
// const table = findBlockById<TableBlockType>({
//   richText: article,
//   targetId: 'row-id-here',
//   path: ['rows', 'id'],
//   condition: (block) => block.blockType === 'table'
// })
