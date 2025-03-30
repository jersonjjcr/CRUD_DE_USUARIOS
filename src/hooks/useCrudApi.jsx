import { useEffect, useState } from 'react'
import axios from 'axios'

export function useCrudApi (url) {
  const [list, setList] = useState([])

  const api = axios.create({
    baseURL: url
  })

  const request = async (method = 'GET', body = null, id = null) => {
    try {
      const res = await api({
        method,
        url: id ? `${id}/` : '',
        data: body
      })

      return res.data
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    read()
  }, [])

  const create = async (newItem) => {
    const data = await request('POST', newItem)
    if (data) setList((prev) => [...prev, data])
  }

  const read = async () => {
    const data = await request()
    if (data.results) setList(data.results)
  }

  const update = async (id, updatedItem, method = 'PUT') => {
    const data = await request(method, updatedItem, id)
    if (data) setList((prev) => prev.map(item => item.id === id ? data : item))
  }

  const remove = async (id) => {
    try {
      await api.delete(`${id}`)
      setList((prev) => prev.filter(item => item.id !== id))
    } catch (error) {
      console.log(error)
    }
  }

  return [list, { create, update, remove }]
}