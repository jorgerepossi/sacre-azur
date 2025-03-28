"use client";

import { useState } from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart,
  Calendar,
  LineChart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const salesData = {
  daily: [
    { name: "Lun", sales: 42 },
    { name: "Mar", sales: 55 },
    { name: "Mié", sales: 36 },
    { name: "Jue", sales: 48 },
    { name: "Vie", sales: 72 },
    { name: "Sáb", sales: 65 },
    { name: "Dom", sales: 50 },
  ],
  monthly: [
    { name: "Ene", sales: 320 },
    { name: "Feb", sales: 280 },
    { name: "Mar", sales: 305 },
    { name: "Abr", sales: 350 },
    { name: "May", sales: 410 },
    { name: "Jun", sales: 380 },
  ],
};

const productGrowthData = [
  { name: "Floral", count: 24, growth: 12 },
  { name: "Cítrico", count: 18, growth: 8 },
  { name: "Oriental", count: 15, growth: -3 },
  { name: "Amaderado", count: 21, growth: 15 },
];

const topSellingProducts = [
  { name: "Chanel No. 5", sales: 128, percentage: 12 },
  { name: "Dior Sauvage", sales: 95, percentage: 8 },
  { name: "Gucci Bloom", sales: 87, percentage: 7 },
  { name: "Tom Ford Tobacco Vanille", sales: 76, percentage: 6 },
];

export default function SalesOverview() {
  const [timeRange, setTimeRange] = useState("monthly");

  const totalSales = salesData[timeRange as keyof typeof salesData].reduce(
    (sum, item) => sum + item.sales,
    0,
  );

  const totalProductGrowth = productGrowthData.reduce(
    (sum, item) => sum + item.growth,
    0,
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Análisis de Ventas</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Descargar Reporte
          </Button>
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Últimos 7 días</SelectItem>
              <SelectItem value="monthly">Últimos 6 meses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ventas Totales
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.round(totalSales * 0.15)} desde el período anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nuevos Productos
            </CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productGrowthData.reduce((sum, item) => sum + item.count, 0)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {totalProductGrowth > 0 ? (
                <>
                  <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500">+{totalProductGrowth}</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                  <span className="text-red-500">{totalProductGrowth}</span>
                </>
              )}
              <span className="ml-1">desde el período anterior</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasa de Conversión
            </CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">+2.1%</span>
              <span className="ml-1">desde el período anterior</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Promedio
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$89.50</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">+$12.40</span>
              <span className="ml-1">desde el período anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Crecimiento de Productos</TabsTrigger>
          <TabsTrigger value="sales">Ventas por Período</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ventas por Período</CardTitle>
              <CardDescription>
                Visualización de ventas durante el período seleccionado
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <div className="flex h-full items-end gap-2">
                  {salesData[timeRange as keyof typeof salesData].map(
                    (item) => (
                      <div
                        key={item.name}
                        className="relative flex flex-1 flex-col items-center"
                      >
                        <div
                          className="w-full rounded-t-md bg-primary transition-all duration-500 ease-in-out"
                          style={{
                            height: `${(item.sales / Math.max(...salesData[timeRange as keyof typeof salesData].map((d) => d.sales))) * 250}px`,
                          }}
                        />
                        <span className="mt-2 text-sm">{item.name}</span>
                        <span className="absolute -top-7 text-xs font-medium">
                          {item.sales}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Crecimiento por Categoría</CardTitle>
                <CardDescription>
                  Crecimiento de productos por categoría
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productGrowthData.map((category) => (
                    <div key={category.name} className="flex items-center">
                      <div className="w-[30%] font-medium">{category.name}</div>
                      <div className="w-[40%] px-4">
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className={`h-2 rounded-full ${category.growth > 0 ? "bg-green-500" : "bg-red-500"}`}
                            style={{
                              width: `${Math.abs(category.growth) * 5}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex w-[30%] items-center">
                        <span className="font-medium">{category.count}</span>
                        <span
                          className={`ml-2 text-xs ${category.growth > 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {category.growth > 0 ? "+" : ""}
                          {category.growth}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Productos Más Vendidos</CardTitle>
                <CardDescription>
                  Los perfumes con mayor número de ventas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSellingProducts.map((product) => (
                    <div key={product.name} className="flex items-center">
                      <div
                        className="w-[60%] truncate font-medium"
                        title={product.name}
                      >
                        {product.name}
                      </div>
                      <div className="flex w-[40%] items-center">
                        <div className="mr-3 h-2 w-full rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${product.percentage * 8}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">
                          {product.sales}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
