exports.createPaymentIntent = async (req, res) => {
    try {
        // Example placeholder
        const amount = req.body.amount;
        if (!amount) return res.status(400).json({ message: 'Amount required' });

        // Use Stripe here
        res.status(200).json({ success: true, message: `Payment of $${amount} received.` });
    } catch (err) {
        res.status(500).json({ message: 'Payment error' });
    }
};
