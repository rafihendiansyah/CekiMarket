<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seller extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'storeName',
        'storeDescription',
        'picName',
        'picPhone',
        'picEmail',
        'picStreet',
        'picRT',
        'picRW',
        'picVillage',
        'picCity',
        'picProvince',
        'picNumber',
        'picPhotoPath',
        'picKtpPath',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
