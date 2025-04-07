// Test cases for the "Feels Like" temperature functionality
const {  getFeelsLikeTemperature, updateFeelsLike, updateFeelsLikeByGeolocation } = require('../feels-like/feelsLike');

global.fetch = jest.fn();

describe('getFeelsLikeTemperature', () => {
    beforeEach(() => {
        fetch.mockClear();
        document.body.innerHTML = '<div id="feels-like"></div>';
        localStorage.clear();
    });

    it('fetches and displays "Feels Like" temperature for a valid city', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                main: { feels_like: 75.5 },
            }),
        });

        localStorage.setItem('showFeelsLike', 'true');
        await getFeelsLikeTemperature('Charlotte');

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('q=Charlotte')
        );
        expect(document.getElementById('feels-like').innerText).toBe(
            'Feels Like: 76°F'
        );
    });

    it('handles API errors gracefully', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'City not found' }),
        });

        await getFeelsLikeTemperature('InvalidCity');

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('q=InvalidCity')
        );
        expect(document.getElementById('feels-like').innerText).toBe(
            'Error: City not found'
        );
    });

    it('handles unexpected API response format', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        await getFeelsLikeTemperature('Charlotte');

        expect(document.getElementById('feels-like').innerText).toBe(
            'Error: Unable to fetch "Feels Like" temperature.'
        );
    });

    it('displays nothing if "showFeelsLike" is false', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                main: { feels_like: 75.5 },
            }),
        });

        localStorage.setItem('showFeelsLike', 'false');
        await getFeelsLikeTemperature('Charlotte');

        expect(document.getElementById('feels-like').innerText).toBe('');
    });

    it('handles network errors gracefully', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'));

        await getFeelsLikeTemperature('Charlotte');

        expect(document.getElementById('feels-like').innerText).toBe(
            'Error: Unable to fetch weather data.'
        );
    });
});