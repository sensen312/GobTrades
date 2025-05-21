// NEW FILE: Interface for MarketService.

using GobTrades.Backend.Dtos;
using System.Threading.Tasks;

namespace GobTrades.Backend.Services
{
    public interface IMarketService
    {
        Task<MarketStatusResponseDto> GetMarketStatusAsync();
    }
}
