export default async (survey_id, user_id, data) => {
  const response = await fetch('https://widget.ink/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
          mutation ($survey_id: ID!, $user_id: ID!, $data: JSON!) {
               surveyCreateAnswer(
                  survey_id: $survey_id,
                  user_id: $user_id,
                  data: $data
               ) {
                  id
              }
          }
      `,
      variables: {
        survey_id,
        user_id,
        data: JSON.stringify({ answers: data })
      }
    })
  })
  
  return await response.json()
}

