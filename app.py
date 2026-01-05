from flask import Flask, render_template, request, jsonify
import secrets
import string

app = Flask(__name__)

def generate_password(length, use_upper, use_lower, use_nums, use_symbols):
    """Generates a secure password based on user constraints."""
    chars = ''
    if use_upper: chars += string.ascii_uppercase
    if use_lower: chars += string.ascii_lowercase
    if use_nums:  chars += string.digits
    if use_symbols: chars += string.punctuation

    # Fallback if no option is selected
    if not chars:
        return "Select an option!"

    # Generate password
    return ''.join(secrets.choice(chars) for _ in range(length))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    length = int(data.get('length', 12))
    use_upper = data.get('upper', True)
    use_lower = data.get('lower', True)
    use_nums = data.get('nums', True)
    use_symbols = data.get('symbols', True)

    password = generate_password(length, use_upper, use_lower, use_nums, use_symbols)
    
    # Simple strength calculation for the UI
    strength = 'Weak'
    if length >= 12 and (use_upper and use_lower and use_nums and use_symbols):
        strength = 'Strong'
    elif length >= 8 and ((use_upper and use_lower) or (use_nums and use_symbols)):
        strength = 'Medium'
        
    return jsonify({'password': password, 'strength': strength})

if __name__ == '__main__':
    app.run(debug=True)