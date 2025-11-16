// get advice from API
async function fetchAdvice() {
    try {
        const response = await fetch('https://api.adviceslip.com/advice');
        if (!response.ok) throw new Error("Could not fetch advice");
        const data = await response.json();
        if (!data.slip || !data.slip.id || !data.slip.advice) {
            throw new Error("Empty or malformed advice data received");
        }
        return data;
    }
    catch (error) {
        console.error('[L1] An Error occurred while fetching advice:', error.message);
        throw error;
    }
}

// process advice data
async function processAdvice() {
    try {
        const data = await fetchAdvice();
        return { id: data.slip.id, advice: data.slip.advice };
    }
    catch (error) {
        console.error('[L2] An Error occurred while processing advice:', error.message);
        const defaultAdvice = 'It always seems impossible until it is done.';
        return { id: "000", advice: defaultAdvice };
    }
}

// display advice on the webpage
async function displayAdvice() {
    document.querySelector('button[onclick="displayAdvice()"]').disabled = true;
    showLoader();
    try {
        const adviceData = await processAdvice();
        const adviceIdElement = document.getElementById('advice-id');
        const adviceTextElement = document.getElementById('advice-text');
        document.startViewTransition(() => {
            adviceIdElement.textContent = `${adviceData.id.toString().padStart(3, '0')}`;
            adviceTextElement.textContent = `${adviceData.advice}`;
        });
    }
    catch (error) {
        console.error('[L3] An Error occurred while displaying advice:', error.message);
    }
    finally {
        document.querySelector('button[onclick="displayAdvice()"]').disabled = false;
        hideLoader();
    }
}

// Skeleton loader functions
function showLoader() {
    const blockquote = document.querySelector('blockquote');
    const adviceTextElement = document.getElementById('advice-text');

    const loader = document.createElement('div');
    loader.setAttribute('role', 'status');
    loader.className = 'space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center';
    loader.innerHTML = `
                <div class="w-full mx-auto">
                    <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
                    <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
                    <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
                    <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
                    <div class="h-4 mx-auto bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                </div>
                <span class="sr-only">Loading...</span>`;

    adviceTextElement.style.display = 'none';
    blockquote.appendChild(loader);
}

function hideLoader() {
    const blockquote = document.querySelector('blockquote');
    const adviceTextElement = document.getElementById('advice-text');
    const loader = blockquote.querySelector('div[role="status"]');
    if (loader) {
        loader.remove();
    }
    adviceTextElement.style.display = 'block';
}

// Initial advice display on page load
document.addEventListener('DOMContentLoaded', async () => {
    await displayAdvice();
});



