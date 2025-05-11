<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "../axios";
import moment from "moment";
import MassageModal from "../components/MassageModal.vue";
import Pagination from '../components/Pagination.vue'

const articles = ref([]);
const articlesCount = ref(0);
const page = ref(1);
const pageSize = 10;
const openMenuIndex = ref(null);
const router = useRouter();
const showDeleteModal = ref(false);
const articleToDelete = ref(null);

const totalPages = computed(() => Math.ceil(articlesCount.value / pageSize));

const pagination = computed(() => {
  const pages = [];
  if (totalPages.value <= 7) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i);
  } else {
    if (page.value > 3) pages.push(1);
    if (page.value > 4) pages.push("...");
    for (
      let i = Math.max(1, page.value - 1);
      i <= Math.min(totalPages.value, page.value + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page.value < totalPages.value - 3) pages.push("...");
    if (page.value < totalPages.value - 2) pages.push(totalPages.value);
  }
  return pages;
});

async function fetchArticles() {
  const { data } = await axios.get("/articles", {
    params: {
      limit: pageSize,
      offset: (page.value - 1) * pageSize,
    },
  });
  articles.value = data.articles;
  articlesCount.value = data.articlesCount;
}

function toggleMenu(idx) {
  openMenuIndex.value = openMenuIndex.value === idx ? null : idx;
}

function editArticle(slug) {
  router.push(`/article/${slug}/edit`);
}

function openDeleteModal(slug) {
  articleToDelete.value = slug;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  articleToDelete.value = null;
  openMenuIndex.value = null;
}

async function confirmDelete() {
  if (!articleToDelete.value) return;
  await axios.delete(`/articles/${articleToDelete.value}`);
  if (window.toastRef && typeof window.toastRef.showToast === 'function') {
    window.toastRef.showToast('Article deleted successfuly', 'success')
  }
  closeDeleteModal();
  fetchArticles();
}

function formatDate(date) {
  return moment(date).format("D/M/YYYY");
}

onMounted(fetchArticles);
watch(page, fetchArticles);
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg mx-auto">
    <h2 class="text-xl font-bold mb-6 p-6">All Posts</h2>
    <div class="border-b border-b-zinc-200"></div>
    <div class="overflow-x-auto h-full p-6">
      <table class="w-full text-left min-w-[700px]">
        <thead>
          <tr class="border-b border-b-zinc-300 bg-zinc-100 rounded-lg">
            <th class="py-2 px-3 text-neutral-800 text-lg font-semibold pl-7">#</th>
            <th class="py-2 px-3 text-neutral-800 text-lg font-semibold">
              Title
            </th>
            <th class="py-2 px-3 text-neutral-800 text-lg font-semibold">
              Author
            </th>
            <th class="py-2 px-3 text-neutral-800 text-lg font-semibold">
              Tags
            </th>
            <th class="py-2 px-3 text-neutral-800 text-lg font-semibold">
              Excerpt
            </th>
            <th class="py-2 px-3 text-neutral-800 text-lg font-semibold">
              Created
            </th>
            <th class="py-2 px-3"></th>
          </tr>
        </thead>
        <tbody v-if="articles.length>0">
          <tr
            v-for="(article, i) in articles"
            :key="article.slug"
            class="hover:bg-gray-50 border-b border-b-zinc-300"
          >
            <td class="py-2 px-3 font-semibold">
              <div class="bg-zinc-100 w-10 h-10 items-center text-center rounded-md justify-center pt-1">
                {{ (page - 1) * pageSize + i + 1 }}
              </div>
            </td>
            <td class="py-2 px-3 font-semibold">{{ article.title }}</td>
            <td class="py-2 px-3 text-neutral-800">
              {{ article.author.username }}
            </td>
            <td class="py-2 px-3 text-neutral-800">
              {{ article.tagList.join(" , ") }}
            </td>
            <td
              class="py-2 px-3 text-neutral-800 max-w-xs break-words align-top"
              style="max-width: 260px"
            >
              {{
                article.body
                  ? article.body.split(" ").slice(0, 20).join(" ") +
                    (article.body.split(" ").length > 20 ? " ..." : "")
                  : ""
              }}
            </td>
            <td class="py-2 px-3 text-neutral-800">
              {{ formatDate(article.createdAt) }}
            </td>
            <td class="py-2 px-3 relative">
              <button
                @click="toggleMenu(i)"
                class="p-2 border border-zinc-200 rounded-xl"
              >
                <!-- سه نقطه -->
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="19" cy="12" r="2" />
                </svg>
              </button>

              <div
                v-if="openMenuIndex === i"
                class="absolute right-0 mt-2 w-28 bg-white rounded-lg shadow-xl z-10"
              >
                <button
                  @click="editArticle(article.slug)"
                  class="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  @click="openDeleteModal(article.slug)"
                  class="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
                <tbody v-if="articles.length === 0" class="bg-white">
                  <tr>
                    <td colspan="6" class="py-8">
                      <div class="flex flex-col items-center justify-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="text-lg font-medium">No Articles Found</p>
                        <p class="text-sm mt-1">Try adjusting your search or filter to find what you're looking for.</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
      </table>
      <!-- Pagination -->
      <div v-if="pagination.length>0" class="flex justify-end mt-6">
        <Pagination :page="page" :totalPages="totalPages" @update:page="val => page = val" />
      </div>
    </div>

    <MassageModal
      :show="showDeleteModal"
      type="error"
      title="Delete Article"
      message="Are you sure you want to delete this article?"
      :buttons="[
        { label: 'Delete', action: 'confirm', type: 'danger' },
        { label: 'Cancle', action: 'cancel', type: 'default' }
      ]"
      @confirm="confirmDelete"
      @cancel="closeDeleteModal"
    />
  </div>
</template>
