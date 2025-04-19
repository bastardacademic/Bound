<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { invalidate } from "$app/navigation";
  import axios from "axios";

  export let threadId: string;

  let messages = [];
  let newMessage = "";
  let loading = true;

  async function fetchMessages() {
