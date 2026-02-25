import os
import telebot
from flask import Flask, request, render_template, redirect, url_for, flash
from dotenv import load_dotenv

load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "fallback-secret")

# Load environment variables securely
BOT_TOKEN = os.environ.get("BOT_TOKEN")
CHAT_ID = os.environ.get("CHAT_ID")

if not BOT_TOKEN or not CHAT_ID:
    raise ValueError("Missing BOT_TOKEN or CHAT_ID environment variables")

# Initialize Telegram bot
bot = telebot.TeleBot(BOT_TOKEN)


@app.route('/', methods=['GET'])
def home():
    return render_template('new.html')


@app.route('/submit_form', methods=['POST'])
def submit_form():
    try:
        # Get form data safely
        name = request.form.get('name', 'No Name')
        email = request.form.get('email', 'No Email')
        message = request.form.get('message', 'No Message')

        telegram_message = (
            f"📩 New Portfolio Message\n\n"
            f"👤 Name: {name}\n"
            f"📧 Email: {email}\n\n"
            f"💬 Message:\n{message}"
        )

        # Send to Telegram
        bot.send_message(CHAT_ID, telegram_message)

        flash("Message sent successfully!", "success")

    except Exception as e:
        print(f"Error sending message: {e}")
        flash("Error sending message. Please try again later.", "error")

    return redirect(url_for('home'))


if __name__ == '__main__':
    # Local development only
    app.run(host='0.0.0.0', port=5000)