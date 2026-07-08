<?php

namespace App\Http\Controllers;

use App\Actions\Inquiries\SubmitInquiry;
use App\Http\Requests\StoreInquiryRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class KontakController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('Kontak');
    }

    public function store(StoreInquiryRequest $request, SubmitInquiry $submitInquiry): RedirectResponse
    {
        // Honeypot: bots fill hidden fields humans never see. Pretend success
        // without touching the database or sending a notification.
        if (filled($request->validated('company'))) {
            return back();
        }

        $submitInquiry->handle([
            'name' => $request->validated('name'),
            'contact' => $request->validated('contact'),
            'message' => $request->validated('message'),
            'source_page' => url()->previous(),
            'ip_address' => $request->ip(),
        ]);

        return back();
    }
}
