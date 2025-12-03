<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductReview extends Model
{
    use HasFactory;

    // 👇 PENTING: kasih tau nama tabel di database
    protected $table = 'reviews';

    protected $fillable = [
        'product_id',
        'visitor_name',
        'visitor_email',
        'visitor_phone',
        'rating',
        'comment',
    ];

    // Relasi ke produk
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
