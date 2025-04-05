<script>
  import NavBar from '/NavBar.svelte';
  import Footer from '/Footer.svelte';
  import Toast from '/Toast.svelte';
  let message = '';
</script>
<NavBar />
<main><slot /></main>
<Toast {message} />
<Footer />
