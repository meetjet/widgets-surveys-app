export default async id => {
  const response = await fetch('https://widget.ink/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
            query ($id: ID!) {
                 getSurvey(id: $id) {
                    title
                    description
                    questions {
                        id
                        content
                        options {
                            id
                            content
                        }
                    }
                }
            }
        `,
      variables: { id }
    })
  })
  
  const { data: {
    getSurvey
  } } = await response.json()
  
  return getSurvey
}
