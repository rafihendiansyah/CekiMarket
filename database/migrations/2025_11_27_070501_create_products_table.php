<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->foreignId('seller_id')
                ->constrained('sellers')
                ->onDelete('cascade');

            $table->string('name');
            $table->string('category'); // bisa nanti dibuat relasi tabel kategori sendiri
            $table->unsignedBigInteger('price'); // harga dalam rupiah (tanpa koma)
            $table->unsignedInteger('stock');
            $table->text('description')->nullable();

            // simpan path gambar dalam array JSON (maks 5)
            $table->json('images')->nullable();

            // status produk seperti Tokopedia: ACTIVE / INACTIVE
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
