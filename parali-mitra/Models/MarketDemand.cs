namespace ParaliMitra.Models;

public class MarketDemand
{
    public string Id { get; set; } = $"DEM-{Random.Shared.Next(100, 999)}";
    public string BuyerName { get; set; } = string.Empty;
    public string IndustryType { get; set; } = "Biomass Power / Pellets"; // Bio-Ethanol, Pellet Plant, Thermal Power, Paper Mill, Mushroom Cultivation
    public string Location { get; set; } = string.Empty;
    public double RequiredTons { get; set; } = 500;
    public double OfferedPricePerTon { get; set; } = 2200;
    public string AcceptedForm { get; set; } = "Round Bales / Rectangular Bales"; // Loose, Bales, Pellets
    public string ContactPhone { get; set; } = string.Empty;
    public string ExpiryDate { get; set; } = DateTime.UtcNow.AddMonths(2).ToString("yyyy-MM-dd");
    public string Status { get; set; } = "Active";
}
