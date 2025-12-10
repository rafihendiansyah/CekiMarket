<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SellerRejectedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $sellerName;
    public $reason;

    /**
     * Create a new message instance.
     */
    public function __construct($sellerName, $reason = null)
    {
        $this->sellerName = $sellerName;
        $this->reason = $reason ?? 'Data yang Anda berikan belum memenuhi syarat administrasi sebagai penjual. Silakan lengkapi kembali data toko dan ajukan ulang.';
    }

    public function build()
    {
        return $this->subject('Pendaftaran Toko Anda Ditolak | CekiMarket')
            ->view('emails.seller-rejected')
            ->with([
                'sellerName' => $this->sellerName,
                'reason' => $this->reason,
            ]);
    }
}
