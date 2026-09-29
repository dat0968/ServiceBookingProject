import { Service } from "@/types/service";
import { useEffect, useState } from "react";
import { ServiceQuery } from "@/types/service";
import { getService } from "@/services/bookingService";
export function useServices() {
    const [services, setServices] = useState<Service[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // GET
    const fetchServices = async () => {
        try {
            setLoading(true);
            setError("");
            const query: ServiceQuery = {
                search,
                page,
                pageSize
            }
            const response = await getService(query);
            setServices(response.data);
            setTotalPages(response.totalPages);
        } catch {
            setError("Không thể tải danh sách dịch vụ.");
        } finally{
            setLoading(false);
        }
    }
    useEffect(()=> {
        fetchServices()
    }, [search, page, pageSize])

    // SEARCH
    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    // PAGINATION
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };
    return {
        services,
        search,
        page,
        pageSize,
        totalPages,
        loading,
        error,
        handleSearch,
        handlePageChange,
    };
}