document.addEventListener('DOMContentLoaded', () => {
    const lengthSlider = document.getElementById('length');
    const lengthVal = document.getElementById('length-val');
    const generateBtn = document.getElementById('generate-btn');
    const output = document.getElementById('password-output');
    const copyBtn = document.getElementById('copy-btn');
    const strengthBar = document.getElementById('strength-bar');

    // Update slider number on drag
    lengthSlider.oninput = function() {
        lengthVal.innerHTML = this.value;
    }

    generateBtn.addEventListener('click', async () => {
        const payload = {
            length: lengthSlider.value,
            upper: document.getElementById('upper').checked,
            lower: document.getElementById('lower').checked,
            nums: document.getElementById('nums').checked,
            symbols: document.getElementById('symbols').checked
        };

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            output.value = data.password;
            updateStrength(data.strength);
            
        } catch (error) {
            console.error('Error:', error);
            output.value = "Error generating password";
        }
    });

    function updateStrength(strength) {
        // Reset classes
        strengthBar.className = 'strength-indicator';
        
        // Add new class based on backend response
        if (strength === 'Weak') strengthBar.classList.add('strength-weak');
        if (strength === 'Medium') strengthBar.classList.add('strength-medium');
        if (strength === 'Strong') strengthBar.classList.add('strength-strong');
    }

    copyBtn.addEventListener('click', () => {
        if (!output.value) return;
        
        // Select text
        output.select();
        output.setSelectionRange(0, 99999); /* For mobile */
        
        // Copy
        navigator.clipboard.writeText(output.value);
        
        // Visual feedback
        const originalIcon = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        setTimeout(() => {
            copyBtn.innerHTML = originalIcon;
        }, 1500);
    });
    
    // Generate one immediately on load
    generateBtn.click();
});