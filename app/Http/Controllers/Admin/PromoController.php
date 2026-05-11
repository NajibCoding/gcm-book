<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class PromoController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Promos/Index', [
            'promos' => Promo::orderByDesc('created_at')->paginate(20),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Promos/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'code' => 'required|string|unique:promos,code|max:50',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'discount_type' => 'required|in:percent,fixed',
            'discount_value' => 'required|numeric|min:0',
            'min_booking' => 'nullable|numeric|min:0',
            'max_usage' => 'nullable|integer|min:1',
            'valid_from' => 'required|date',
            'valid_until' => 'required|date|after:valid_from',
            'is_active' => 'boolean',
        ]);

        Promo::create($data);

        return redirect()->route('admin.promos.index')->with('success', 'Promo berhasil dibuat.');
    }

    public function edit(Promo $promo): Response
    {
        return Inertia::render('Admin/Promos/Edit', ['promo' => $promo]);
    }

    public function update(Request $request, Promo $promo): RedirectResponse
    {
        $data = $request->validate([
            'code' => 'required|string|unique:promos,code,' . $promo->id . '|max:50',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'discount_type' => 'required|in:percent,fixed',
            'discount_value' => 'required|numeric|min:0',
            'min_booking' => 'nullable|numeric|min:0',
            'max_usage' => 'nullable|integer|min:1',
            'valid_from' => 'required|date',
            'valid_until' => 'required|date|after:valid_from',
            'is_active' => 'boolean',
        ]);

        $promo->update($data);

        return redirect()->route('admin.promos.index')->with('success', 'Promo diperbarui.');
    }

    public function destroy(Promo $promo): RedirectResponse
    {
        $promo->delete();

        return redirect()->route('admin.promos.index')->with('success', 'Promo dihapus.');
    }
}
