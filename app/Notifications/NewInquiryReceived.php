<?php

namespace App\Notifications;

use App\Models\Inquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewInquiryReceived extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly Inquiry $inquiry) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New inquiry — '.$this->inquiry->name)
            ->line("From: {$this->inquiry->name}")
            ->line("Contact: {$this->inquiry->contact}")
            ->line('Message:')
            ->line($this->inquiry->message);
    }
}
