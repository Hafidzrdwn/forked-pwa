import type { Decision } from '../types'

const DB_NAME = 'forked-local'
const STORE_NAME = 'decisions'
const DB_VERSION = 1

function cloneData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is not available in this browser.'))
      return
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getAllDecisions(): Promise<Decision[]> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const request = tx.objectStore(STORE_NAME).getAll()
    request.onsuccess = () => resolve((request.result as Decision[]) || [])
    request.onerror = () => reject(request.error)
  })
}

export async function putDecision(decision: Decision): Promise<void> {
  const db = await openDatabase()
  const clean = cloneData(decision)
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(clean)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function deleteDecision(id: string): Promise<void> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function replaceAllDecisions(decisions: Decision[]): Promise<void> {
  const db = await openDatabase()
  const clean = cloneData(decisions)
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.clear()
    clean.forEach((decision) => store.put(decision))
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}
