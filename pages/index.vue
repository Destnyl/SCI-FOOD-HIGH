<template>
  <div class="container mx-auto p-4 text-center">
    <!-- Logo and Title Section -->
    <div class="flex flex-col items-center justify-center mb-8">
      <img
        src="/school_logo.png"
        alt="School Logo"
        class="w-20 h-20 mb-4 rounded-full shadow-lg"
      />
      <h1 class="font-poppins text-4xl md:text-5xl font-bold text-maroon mb-2">
        SCI-FOOD-HIGH
      </h1>
      <p class="text-lg text-maroon/80 mb-2">School Food Ordering System</p>
      <p class="text-base text-gray-600">
        Order ahead and skip the line. Fresh menus daily.
      </p>
    </div>

    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <div
        class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
      >
        <div class="flex flex-col items-center">
          <div
            class="w-16 h-16 bg-maroon/10 rounded-full flex items-center justify-center mb-4"
          >
            <svg
              class="w-8 h-8 text-maroon"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-maroon mb-3">For Students</h3>
          <p class="text-gray-600 mb-6 text-center">
            Browse daily menu, add items to cart, place orders, and track your
            order status.
          </p>
          <NuxtLink
            to="/student"
            class="bg-maroon text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
          >
            Student Portal
          </NuxtLink>
        </div>
      </div>

      <div
        class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
      >
        <div class="flex flex-col items-center">
          <div
            class="w-16 h-16 bg-amber/20 rounded-full flex items-center justify-center mb-4"
          >
            <svg
              class="w-8 h-8 text-amber-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-maroon mb-3">For Staff</h3>
          <p class="text-gray-600 mb-6 text-center">
            Manage menu items, process incoming orders, and view order history
            and analytics.
          </p>
          <NuxtLink
            to="/staff"
            class="bg-amber text-maroon px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
          >
            Staff Portal
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="mt-10">
      <NuxtLink
        to="/login"
        class="bg-burnt text-white px-8 py-4 rounded-xl hover:bg-opacity-90 transition-colors font-medium text-lg shadow-lg"
      >
        Login to Get Started
      </NuxtLink>
    </div>
  </div>
</template>
