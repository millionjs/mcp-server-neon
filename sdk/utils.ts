import type { AudioContent, ImageContent, TextContent } from '@modelcontextprotocol/sdk/types.js'

import { fileTypeFromBuffer } from 'file-type'
import { readFile } from 'node:fs/promises'

import type { ErrorContent } from './types'

export async function audioContent(
  input: { buffer: Buffer } | { path: string } | { url: string },
): Promise<AudioContent> {
  let rawData: Buffer

  if ('url' in input) {
    const response = await fetch(input.url)

    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${response.statusText}`)
    }

    rawData = Buffer.from(await response.arrayBuffer())
  } else if ('path' in input) {
    rawData = await readFile(input.path)
  } else if ('buffer' in input) {
    rawData = input.buffer
  } else {
    throw new Error("Invalid input: Provide a valid 'url', 'path', or 'buffer'")
  }

  const mimeType = await fileTypeFromBuffer(rawData as unknown as ArrayBuffer)

  const base64Data = rawData.toString('base64')

  return {
    data: base64Data,
    mimeType: mimeType?.mime ?? 'audio/mpeg',
    type: 'audio',
  }
}

export function errorContent(error: string): ErrorContent {
  return {
    content: [textContent(error)],
    isError: true,
  }
}

export async function imageContent(
  input: { buffer: Buffer } | { path: string } | { url: string },
): Promise<ImageContent> {
  let rawData: Buffer

  if ('url' in input) {
    const response = await fetch(input.url)

    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${response.statusText}`)
    }

    rawData = Buffer.from(await response.arrayBuffer())
  } else if ('path' in input) {
    rawData = await readFile(input.path)
  } else if ('buffer' in input) {
    rawData = input.buffer
  } else {
    throw new Error("Invalid input: Provide a valid 'url', 'path', or 'buffer'")
  }

  const mimeType = await fileTypeFromBuffer(rawData as unknown as ArrayBuffer)

  const base64Data = rawData.toString('base64')

  return {
    data: base64Data,
    mimeType: mimeType?.mime ?? 'image/png',
    type: 'image',
  } as const
}

export function textContent(text: string): TextContent {
  return {
    text,
    type: 'text',
  }
}
