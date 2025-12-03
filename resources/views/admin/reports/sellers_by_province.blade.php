<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid black; padding: 6px; }
        th { background: #efefef; }
        h3 { margin-bottom: 0; }
    </style>
</head>
<body>

<h3>Laporan Daftar Toko Berdasarkan Lokasi Provinsi</h3>
<p>Tanggal dibuat: {{ $generatedAt->format('d-m-Y') }} oleh {{ $adminName }}</p>

<table>
    <thead>
        <tr>
            <th>No</th>
            <th>Nama Toko</th>
            <th>Nama PIC</th>
            <th>Provinsi</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($sellers as $index => $s)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $s->storeName }}</td>
                <td>{{ $s->picName }}</td>
                <td>{{ $s->picProvince }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

<p style="font-size:10px; margin-top:10px;">
    ** Diurutkan berdasarkan provinsi
</p>

</body>
</html>
