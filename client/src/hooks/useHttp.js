import React, {useCallback, useState} from 'react';

export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const request = useCallback(async (url, method = "GET", body = null, headers = {}) => {
        try {
            setLoading(true)

            if (body) {
                if (method === "POST") {
                    body = JSON.stringify(body)
                    headers['Content-Type'] = 'application/json'
                }else {
                    let queryArr = Object.entries(body)
                    let numCycle = 0
                    for (let row of queryArr) {
                        numCycle++

                        if (numCycle === 1) {
                            url += "?" + row[0] + "=" + row[1]
                        }else {
                            url += "&" + row[0] + "=" + row[1]
                        }
                    }
                    body = null
                }
            }


            const response = await fetch(url, {method, body, headers})
            let data = await response.json()
            let clientHeaders = []

            const abc = [...response.headers].map(header => {
                clientHeaders[header[0]] = header[1]
            })
            data.headers = clientHeaders

            if (!response.ok) {
                throw new Error(data.message || "Что то пошло не так")
            }
            return data

        } catch (e) {
            setError(e.message)
            throw e
        } finally {
            setLoading(false)
        }
    }, [])

    const clearError = () => setError(null)

    return [request, loading, error, clearError]
};

