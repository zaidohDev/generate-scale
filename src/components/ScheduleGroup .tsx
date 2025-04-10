import React, { useRef, useState } from "react";
import ScheduleEditor from "./ScheduleEditor";
import html2pdf from "html2pdf.js";

interface Policial {
    nome: string;
    matricula: string;
    inicio: string;
    fim: string;
}

const ScheduleGroup: React.FC = () => {
    const [faixas, setFaixas] = useState(3);
    const [dadosPorFaixa, setDadosPorFaixa] = useState<
        { data: string; ocupantes: Policial[] }[]
    >(
        Array.from({ length: 3 }, () => ({
            data: "",
            ocupantes: Array(8).fill({ nome: "", matricula: "", inicio: "", fim: "" })
        }))
    );
    const printRef = useRef<HTMLDivElement>(null);

    const atualizarFaixa = (index: number, novaData: string, novosOcupantes: Policial[]) => {
        const novosDados = [...dadosPorFaixa];
        novosDados[index] = { data: novaData, ocupantes: novosOcupantes };
        setDadosPorFaixa(novosDados);
    };

    const handleChangeFaixas = (valor: number) => {
        setFaixas(valor);
        setDadosPorFaixa((prev) => {
            const novos = [...prev];
            while (novos.length < valor) {
                novos.push({
                    data: "",
                    ocupantes: Array(7).fill({ nome: "", matricula: "", inicio: "", fim: "" })
                });
            }
            return novos.slice(0, valor);
        });
    };

    const exportarTudoPDF = () => {
        if (!printRef.current) return;
        html2pdf()
            .set({
                margin: 7,
                filename: "escala-completa.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 1 },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                pagebreak: { mode: ["avoid"] },
            })
            .from(printRef.current)
            .save();
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="mb-6 flex items-center gap-4">
                <label className="text-sm text-[color:var(--color-muted)]">Número de faixas:</label>
                <select
                    value={faixas}
                    onChange={(e) => handleChangeFaixas(Number(e.target.value))}
                    className="bg-[color:var(--color-bg)] border border-[color:var(--color-peach)] text-[color:var(--color-text)] px-2 py-1 rounded"
                >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                </select>

                <button
                    onClick={exportarTudoPDF}
                    className="ml-auto bg-[color:var(--color-peach)] text-[color:var(--color-bg)] px-4 py-2 rounded font-semibold hover:opacity-90 transition"
                >
                    🖨️ Exportar PDF Geral
                </button>
            </div>

            <div ref={printRef} className="flex flex-col gap-4 text-sm">
                {[...Array(faixas)].map((_, index) => (
                    <div key={index} className="break-inside-avoid">
                        <h2 className="text-lg font-bold mb-2 text-[color:var(--color-peach)]">
                            {index + 1}ª Faixa
                        </h2>
                        <ScheduleEditor
                            faixaIndex={index}
                            data={dadosPorFaixa[index].data}
                            ocupantes={dadosPorFaixa[index].ocupantes}
                            onUpdate={(novaData, novosOcupantes) => atualizarFaixa(index, novaData, novosOcupantes)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScheduleGroup;
