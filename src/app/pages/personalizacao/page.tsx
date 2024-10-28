'use client';
import { Container } from "@mui/material";
import { useState } from "react"
import { Tabs } from "./components/Tabs";
import { ExpenseCategoriesPage } from "./components/ExpenseCategoriesPage";
import { DestinysPage } from "./components/DestinysPage";
import { BanksPage } from "./components/BanksPage";
import { usePooling } from "@/app/utils/usePooling";
import { UtilTypes } from "@/database/UtilTypes";
import moment from "moment";

export default function page() {
    let [selectedCategory, setSelectedCategory] = useState(0)

    let { data, force } = usePooling<UtilTypes.PersonalizacaoPageData>("/api/pagesData", moment.duration(5, "seconds").asMilliseconds(), {
        params: {
            pageRoute: "personalizacao",
        },
    })

    if (!data) {
        return (
            <div>Carregando...</div>
        )
    }

    return (
        <Container maxWidth="xl" className="pt-12">
            <Tabs selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

            <div hidden={selectedCategory !== 0} className="p-3" style={{ background: "linear-gradient(0deg, rgba(49, 51, 56, 0.9) 66.87%, rgba(49, 51, 56, 0.9) 100%)" }}>
                <DestinysPage destinys={data.Destinys} forceReload={force} />
            </div>

            <div hidden={selectedCategory !== 1} className="p-3" style={{ background: "linear-gradient(0deg, rgba(49, 51, 56, 0.9) 66.87%, rgba(49, 51, 56, 0.9) 100%)" }}>
                <BanksPage banks={data.Banks} forceReload={force} />
            </div>

            <div hidden={selectedCategory !== 2} className="p-3" style={{ background: "linear-gradient(0deg, rgba(49, 51, 56, 0.9) 66.87%, rgba(49, 51, 56, 0.9) 100%)" }}>
                <ExpenseCategoriesPage expensecategories={data.ExpenseCategories} forceReload={force} />
            </div>

        </Container>
    )
}