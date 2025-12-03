<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReviewThankYouMail extends Mailable
{
    use Queueable, SerializesModels;

    public $name;
    public $productName;
    public $rating;

    public function __construct($name, $productName, $rating)
    {
        $this->name = $name;
        $this->productName = $productName;
        $this->rating = $rating;
    }

    public function build()
    {
        return $this->subject('Terima Kasih atas Review Anda!')
            ->view('emails.thank_you_review');
    }
}