<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { HighlightAuto } from "svelte-highlight";
  import atomOneDark from "svelte-highlight/styles/atom-one-dark";
  import ClipboardJS from "clipboard";
  import toast, { Toaster } from "svelte-french-toast";
  import { jsPDF } from "jspdf";
  import { goto } from "$app/navigation"; // Importing goto for navigation

  let id = null;
  let paste = null;
  let code = null;
  let errorMessage = "";
  const doc = new jsPDF();

  onMount(async () => {
    id = $page.params.id; // Get the ID from the URL parameters
    console.log(`fetching /api?id=${id}`);

    try {
      // Fetching the paste using the updated route
      const res = await fetch(`/api?id=${id}`);
      if (!res.ok) {
        throw new Error("Invalid or non-existent paste ID.");
      }
      const data = await res.json();
      paste = data.id;
      code = paste.text;
      new ClipboardJS(".btn-clip");
    } catch (error) {
      console.log("Error fetching paste:", error);
      errorMessage =
        "Oops! The paste you are looking for could not be found. Please check the URL and try again. If the issue persists, the paste may have expired or been removed.";
    }
  });

  // Function to format expiration time
  function formatExpirationTime(expirationTimestamp) {
    const secondsRemaining = Math.floor(
      (expirationTimestamp - Date.now()) / 1000
    );

    if (secondsRemaining <= 0) {
      return "Expired";
    } else if (secondsRemaining < 60) {
      return `${secondsRemaining} seconds`;
    } else if (secondsRemaining < 3600) {
      return `${Math.floor(secondsRemaining / 60)} minutes`;
    } else if (secondsRemaining < 86400) {
      return `${Math.floor(secondsRemaining / 3600)} hours`;
    } else {
      return `${Math.floor(secondsRemaining / 86400)} days`;
    }
  }

  // Function to share the link
  async function shareLink() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check this out!",
          text: "I found this interesting link:",
          url: `/${id}`,
        });
        console.log("Link shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Web Share API is not supported in your browser.");
    }
  }
</script>

<svelte:head>
  {@html atomOneDark}
</svelte:head>

{#if errorMessage}
  <div class="flex justify-center items-center h-screen bg-gray-900">
    <div
      class="max-w-lg w-full mx-auto bg-red-900 text-white rounded-lg shadow-xl p-8"
    >
      <div class="flex items-center space-x-3 mb-4">
        <svg
          class="w-8 h-8 text-red-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 10-2 0 1 1 0 002 0zm-.707-7.707a1 1 0 00-1.414 0L8.293 7.293a1 1 0 001.414 1.414L10 7.414l1.293 1.293a1 1 0 001.414-1.414l-2-2z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <h2 class="text-xl font-bold">Error</h2>
      </div>
      <p class="text-md mb-4">{errorMessage}</p>
      <div class="flex justify-end">
        <button
          on:click={() => goto("/")}
          class="bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
{:else if paste}
  <div class="container mx-auto my-8">
    <div class="bg-gray-800 rounded-lg shadow-md p-6">
      <div class="card-actions">
        <div class="badge badge-outline flex justify-between">
          <h1 class="border rounded-lg p-2 text-white text-2xl mb-4">
            {paste.title}
          </h1>
        </div>

        <HighlightAuto code={paste.text} />
      </div>
      <Toaster />
      <div class="flex justify-between">
        <button
          on:click={() => {
            toast.success("Copied to clipboard");
          }}
          class="btn-clip bg-green-600 hover:bg-lime-600 text-white font-medium py-2 px-4 mt-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          data-clipboard-text={paste.text}
        >
          COPY TEXT
        </button>
        <div>
          <button
            on:click={() => {
              doc.text(paste.text, 10, 10);
              doc.save(`${paste.title}.pdf`);
            }}
            class="btn-clip bg-blue-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 mt-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg
              class="h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
          <button
            on:click={shareLink}
            class="btn-clip bg-blue-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 mt-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg
              class="h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="container mx-auto my-8">
    <div class="bg-gray-800 rounded-lg shadow-md p-6">
      <button
        type="button"
        class="bg-indigo-500 text-white rounded px-4 py-2 flex items-center"
        disabled
      >
        <svg
          class="animate-spin h-5 w-5 mr-3 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        Processing...
      </button>
    </div>
  </div>
{/if}
