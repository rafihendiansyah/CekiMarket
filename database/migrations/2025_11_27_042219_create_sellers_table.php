<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sellers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Data Toko
            $table->string('storeName');
            $table->text('storeDescription')->nullable();

            // Data PIC
            $table->string('picName');
            $table->string('picPhone');
            $table->string('picEmail');

            // Alamat PIC
            $table->string('picStreet');
            $table->string('picRT');
            $table->string('picRW');
            $table->string('picVillage');
            $table->string('picCity');
            $table->string('picProvince');

            // Dokumen Identitas PIC
            $table->string('picNumber');          // No KTP PIC
            $table->string('picPhotoPath')->nullable(); // Foto PIC
            $table->string('picKtpPath')->nullable();   // File KTP

            // Status Verifikasi (SellerStatus: PENDING, ACTIVE, REJECTED)
            $table->enum('status', ['PENDING', 'ACTIVE', 'REJECTED'])
                  ->default('PENDING');

            $table->timestamps(); // createdAt, updatedAt
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sellers');
    }
};
