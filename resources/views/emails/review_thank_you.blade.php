<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Terima kasih atas ulasan Anda</title>
</head>
<body style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;">
    <p>Halo {{ $review->visitor_name }},</p>

    <p>
        Terima kasih sudah memberikan komentar dan rating
        untuk produk <strong>{{ $product->name }}</strong> di CekiCekiMart.
    </p>

    <p>
        Rating yang Anda berikan: <strong>{{ $review->rating }}/5</strong><br>
        @if($review->comment)
            Komentar Anda:<br>
            "<em>{{ $review->comment }}</em>"
        @endif
    </p>

    <p>Kami sangat menghargai waktu dan masukan Anda 🙏</p>

    <p>Salam hangat,<br>
    <strong>Tim CekiCekiMart</strong></p>
</body>
</html>
