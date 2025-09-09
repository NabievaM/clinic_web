<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white text-center px-4 sm:px-6 md:px-12"
  >
    <h1
      class="text-[80px] sm:text-[100px] md:text-[120px] font-extrabold text-primary drop-shadow-lg"
    >
      404
    </h1>

    <h2 class="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
      Sahifa topilmadi
    </h2>

    <p class="text-gray-600 max-w-md mb-8 text-sm sm:text-base">
      Siz qidirayotgan sahifa mavjud emas yoki o‘chirib yuborilgan bo‘lishi
      mumkin.
    </p>

    <div class="flex flex-col sm:flex-row gap-4">
      <RouterLink
        to="/"
        class="px-5 py-2 sm:px-6 sm:py-3 rounded-2xl bg-primary text-white font-medium shadow-md hover:bg-primary transition"
      >
        Bosh sahifaga qaytish
      </RouterLink>

      <RouterLink
        to="/contact"
        class="px-5 py-2 sm:px-6 sm:py-3 rounded-2xl border border-primary text-primary font-medium shadow-md hover:bg-blue-50 transition"
      >
        Biz bilan bog‘lanish
      </RouterLink>
    </div>
  </div>
</template>
