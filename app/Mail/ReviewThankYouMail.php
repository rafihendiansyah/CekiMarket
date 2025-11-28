<?php

namespace App\Mail;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReviewThankYouMail extends Mailable
{
    use Queueable, SerializesModels;

    public Product $product;
    public Review $review;

    /**
     * Create a new message instance.
     */
    public function __construct(Product $product, Review $review)
    {
        $this->product = $product;
        $this->review = $review;
    }

    /**
     * Build the message.
     */
    public function build(): self
    {
        return $this->subject('Terima kasih atas ulasan Anda di CekiCekiMart')
            ->view('emails.review_thank_you');
    }
}
