<?php

namespace Tests\Feature;

use App\Mail\ContactInquiry;
use App\Models\ContactMessage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactFormTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_contact_message_is_saved_and_mailed_to_the_band(): void
    {
        Mail::fake();

        $this->postJson('/api/contact', [
            'name' => 'Alex Rider',
            'email' => 'alex@example.com',
            'message' => 'Can you play Park City in March?',
        ])
            ->assertOk()
            ->assertJsonPath('message', 'Thanks. Your message was sent.');

        $this->assertDatabaseHas('contact_messages', [
            'name' => 'Alex Rider',
            'email' => 'alex@example.com',
            'message' => 'Can you play Park City in March?',
        ]);

        Mail::assertSent(ContactInquiry::class, function (ContactInquiry $mail): bool {
            return $mail->hasTo('contact@ratsband.com')
                && $mail->hasReplyTo('alex@example.com')
                && $mail->inquiry->is(ContactMessage::query()->first());
        });
    }

    public function test_a_filled_honeypot_does_not_send_mail(): void
    {
        Mail::fake();

        $this->postJson('/api/contact', [
            'name' => 'Bot',
            'email' => 'bot@example.com',
            'message' => 'Buy this',
            'bot-field' => 'filled',
        ])->assertOk();

        $this->assertDatabaseCount('contact_messages', 0);
        Mail::assertNothingSent();
    }
}
