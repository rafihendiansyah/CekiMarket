<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        
        // Eager load seller relationship if user exists
        if ($user) {
            $user->load('seller');
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'seller' => $user->seller ? [
                        'id' => $user->seller->id,
                        'status' => $user->seller->status,
                        'submission_count' => $user->seller->submission_count ?? 1,
                    ] : null,
                ] : null,
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
            'categories' => config('product_categories', []),
        ];
    }

}
