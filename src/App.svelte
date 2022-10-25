<script>
  import querySurvey from "./lib/querySurvey.js";
  import mutationSurvey from "./lib/mutationSurvey.js";

  const [id] = window.location.pathname.split("/").filter(a => !!a);

  let survey;
  let hasError = false;
  let loading = false;
  let surveyEnd = false;
  let startingPoint = 0;
  let localStoragesSurveys;

  (async _id => {
    if (!_id) {
      return false;
    }

    try {
      const response = await querySurvey(_id);

      if (response.errors) {
        hasError = true;
        console.error(response.errors);
      } else {
        survey = response.data.getSurvey;

        localStoragesSurveys = localStorage.getItem('surveys') ?? "{}";
        localStoragesSurveys = JSON.parse(localStoragesSurveys);

        if (!localStoragesSurveys[id]) {
          localStoragesSurveys[id] = { answers: [], ended: false };
        }

        startingPoint = localStoragesSurveys[id].answers.length;
        surveyEnd = localStoragesSurveys[id].ended;
      }
    } catch (err) {
      hasError = true;
      console.error(err);
    }
  })(id)

  async function optionHandler(questionID, optionID) {
    if (startingPoint === survey.questions.length - 1) {
      try {
        const response = await mutationSurvey(id, 4, localStoragesSurveys[id].answers);

        if (response.errors) {
          hasError = true;
          console.error(response.errors);
        } else {
          localStoragesSurveys[id].ended = surveyEnd = loading = true
        }
      } catch (err) {
        console.error(err)
      }

      loading = false
    } else {
      startingPoint += 1;

      localStoragesSurveys[id].answers.push({
        question_id: questionID,
        option_id: optionID
      });
    }

    localStorage.setItem('surveys', JSON.stringify(localStoragesSurveys));
  }
</script>

{#if id}
    {#if hasError}
        <div class="border shadow rounded-lg w-1/2 mx-auto p-3 text-center">Something went wrong</div>
    {:else if survey}
        {#if loading}
            <div class="border shadow rounded-lg w-1/2 mx-auto p-3 text-center">Loading</div>
        {:else if surveyEnd}
            <div class="border shadow rounded-lg w-1/2 mx-auto p-3 text-center">Survey finished</div>
        {:else}
            <div class="border shadow rounded-lg w-1/2 mx-auto p-3">
                <header class="mb-3">
                    <div class="text-2xl font-bold">{survey.title}</div>
                    <p class="text-sm">{survey.description}</p>
                </header>

                <div>
                    <div class="text-xl font-bold text-center mb-3">{survey.questions[startingPoint].content}</div>
                    <ul class="space-y-2">
                        {#each survey.questions[startingPoint].options as option}
                            <li>
                                <button
                                    type="button"
                                    class="w-full border rounded p-2 hover:bg-gray-50 transition-colors duration-300"
                                    on:click={optionHandler.bind(null, survey.questions[startingPoint].id, option.id)}
                                >{option.content}</button>
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>
        {/if}
    {/if}
{:else}
    <div class="border shadow rounded-lg w-1/2 mx-auto p-3 text-center">Id wos not found</div>
{/if}


