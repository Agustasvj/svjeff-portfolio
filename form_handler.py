import telebot
from flask import Flask, request, render_template

# Initialize Flask app
app = Flask(__name__)

# Your Telegram bot token (get from @BotFather)
BOT_TOKEN = 'BOT TOKEN HERE'
# Your Telegram chat ID (get from @userinfobot)
CHAT_ID = 'CHAT ID'

# Initialize the Telegram bot
bot = telebot.TeleBot(BOT_TOKEN)

@app.route('/', methods=['GET'])
def home():
    return render_template('new.html')

@app.route('/submit_form', methods=['POST'])
def submit_form():
    try:
        # Get form data
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')

        # Create message text
        telegram_message = (
            f"New Website Message!\n\n"
            f"From: {name}\n"
            f"Email: {email}\n"
            f"Message:\n{message}"
        )

        # Send message to Telegram
        bot.send_message(CHAT_ID, telegram_message)
        
        return """
        <script>
            alert('Message sent successfully!');
            window.location.href = '/';
        </script>
        """
    except Exception as e:
        print(f"Error: {e}")
        return """
        <script>
            alert('Error sending message. Please try again later.');
            window.location.href = '/';
        </script>
        """

if __name__ == '__main__':
    app.run(debug=True) 
