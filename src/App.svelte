<script>
  const [id] = window.location.pathname.split("/").filter(a => !!a)
  console.log(id)
</script>

<div class="text-2xl">{id}</div>
