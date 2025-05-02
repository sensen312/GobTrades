using System.Collections.Generic; // Required for List

namespace GobTrades.Backend.Dtos
{
    public class PaginatedResponseDto<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public bool HasMore { get; set; }
        public int? TotalItems { get; set; }
        public int? CurrentPage { get; set; }
        public int? TotalPages { get; set; }
    }
}