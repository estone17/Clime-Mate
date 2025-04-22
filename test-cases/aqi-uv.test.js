const { getAQIandUV } = require('../aqi-uvFixed/aqi-uv');

describe('getAQIandUV', () => {
    const mockFetch = jest.fn();

    beforeEach(() => {
        global.fetch = mockFetch;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return AQI and UV data when API calls are successful', async () => {
        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: [{ aqi: 42 }]
                })
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: [{ uv: 5.3 }]
                })
            });

        const result = await getAQIandUV(35.6895, 139.6917); // Example coordinates for Tokyo
        expect(result).toEqual({ aqi: 42, uv: 5.3 });
    });

    it('should return "N/A" for AQI if the AQI API call fails', async () => {
        mockFetch
            .mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: 'Error' })
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: [{ uv: 5.3 }]
                })
            });

        const result = await getAQIandUV(35.6895, 139.6917);
        expect(result).toEqual({ aqi: 'N/A', uv: 5.3 });
    });

    it('should return "N/A" for UV if the UV API call fails', async () => {
        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: [{ aqi: 42 }]
                })
            })
            .mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: 'Error' })
            });

        const result = await getAQIandUV(35.6895, 139.6917);
        expect(result).toEqual({ aqi: 42, uv: 'N/A' });
    });

    it('should return null if latitude or longitude is missing', async () => {
        const result = await getAQIandUV(null, null);
        expect(result).toBeNull();
    });

    it('should handle API errors gracefully and return "N/A" for both AQI and UV', async () => {
        mockFetch.mockRejectedValue(new Error('API error'));

        const result = await getAQIandUV(35.6895, 139.6917);
        expect(result).toEqual({ aqi: 'N/A', uv: 'N/A' });
    });
});
