import React, { useRef, useState } from "react";
import html2pdf from "html2pdf.js";

const postos = ["P1", "P2", "VISOR", "QUADRANTE", "SUP A", "SUP C", "SUP D", "SUP F"];


interface Policial {
    nome: string;
    matricula: string;
    inicio: string;
    fim: string;
}

interface ScheduleEditorProps {
    faixaIndex: number;
    data: string;
    ocupantes: Policial[];
    onUpdate: (data: string, ocupantes: Policial[]) => void;
}

const formatarData = (iso: string) => {
    if (!iso) return "(não definida)";
    const [ano, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${ano}`;
};

const ScheduleEditor: React.FC<ScheduleEditorProps> = ({ faixaIndex, data, ocupantes, onUpdate }) => {
    const [localData, setLocalData] = useState(data);
    const [localOcupantes, setLocalOcupantes] = useState<Policial[]>(ocupantes);
    const [modoVisualizacao, setModoVisualizacao] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    const handleChange = (index: number, field: keyof Policial, value: string) => {
        const novos = [...localOcupantes];
        novos[index] = { ...novos[index], [field]: value };
        setLocalOcupantes(novos);
        onUpdate(localData, novos);
    };

    const handleDataChange = (value: string) => {
        setLocalData(value);
        onUpdate(value, localOcupantes);
    };

    const rotacionar = () => {
        if (localOcupantes.every((p) => p.nome.trim() === "")) return;
        const novaLista = [...localOcupantes];
        const ultimo = novaLista.pop();
        if (ultimo !== undefined) novaLista.unshift(ultimo);
        setLocalOcupantes(novaLista);
        onUpdate(localData, novaLista);
    };

    const salvarJSON = () => {
        const escala = {
            faixa: faixaIndex + 1,
            data: localData,
            postos: postos.map((posto, i) => ({ posto, ...localOcupantes[i] }))
        };
        const blob = new Blob([JSON.stringify(escala, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `escala-upi4-faixa${faixaIndex + 1}.json`;
        link.click();
    };

    const exportarPDF = () => {
        setModoVisualizacao(true);
        setTimeout(() => {
            if (printRef.current) {
                html2pdf()
                    .set({
                        margin: 10,
                        filename: `escala-upi4-faixa${faixaIndex + 1}.pdf`,
                        image: { type: "jpeg", quality: 0.98 },
                        html2canvas: { scale: 2 },
                        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                    })
                    .from(printRef.current)
                    .save()
                    .then(() => setModoVisualizacao(false));
            }
        }, 100);
    };

    return (
        <div className="bg-[color:var(--color-bg)] text-[color:var(--color-text)] rounded-xl border border-[color:var(--color-peach)] overflow-hidden">
            {!modoVisualizacao && (
                <div className="flex flex-wrap justify-between items-center gap-3 p-3">
                    <button
                        onClick={rotacionar}
                        className="bg-[color:var(--color-peach)] text-[color:var(--color-bg)] px-4 py-2 rounded font-semibold hover:opacity-90 transition"
                    >
                        🔁 Rotacionar Escala
                    </button>
                    <button
                        onClick={salvarJSON}
                        className="border border-[color:var(--color-peach)] text-[color:var(--color-peach)] px-4 py-2 rounded font-semibold hover:bg-[color:var(--color-peach)] hover:text-[color:var(--color-bg)] transition"
                    >
                        💾 Salvar como JSON
                    </button>
                    <button
                        onClick={exportarPDF}
                        className="border border-[color:var(--color-peach)] text-[color:var(--color-peach)] px-4 py-2 rounded font-semibold hover:bg-[color:var(--color-peach)] hover:text-[color:var(--color-bg)] transition"
                    >
                        🖨️ Exportar PDF
                    </button>
                </div>
            )}

            <div ref={printRef} className="p-6">
                <div className="text-center mb-6">
                    <div className="text-4xl mb-2">👮</div>
                    <h1 className="text-2xl font-bold uppercase text-[color:var(--color-peach)]">Escala de Postos</h1>
                    <p className="text-sm uppercase text-[color:var(--color-muted)]">UN: Itaitinga-4</p>
                    <p className="text-sm mt-2">
                        {modoVisualizacao ? (
                            <span className="italic">Data: {formatarData(localData)}</span>
                        ) : (
                            <input
                                type="date"
                                value={localData}
                                onChange={(e) => handleDataChange(e.target.value)}
                                className="bg-[color:var(--color-bg)] border border-[color:var(--color-peach)] text-[color:var(--color-text)] rounded px-3 py-1 mt-1"
                            />
                        )}
                    </p>
                </div>

                <table className="w-full text-left border border-[color:var(--color-peach)]">
                    <thead className="bg-[color:var(--color-peach)] text-[color:var(--color-bg)] uppercase text-sm">
                        <tr>
                            <th className="p-3 text-lg">Posto</th>
                            <th className="p-3 text-lg">Nome</th>
                            <th className="p-3 text-lg">Matrícula</th>
                            <th className="p-3 text-lg">Início</th>
                            <th className="p-3 text-lg">Fim</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postos.map((posto, index) => (
                            <tr key={posto} className="border-t border-[color:var(--color-peach)]">
                                <td className="p-3 font-semibold text-[color:var(--color-peach)] text-base">{posto}</td>
                                {modoVisualizacao ? (
                                    <>
                                        <td className="p-3">{localOcupantes[index].nome}</td>
                                        <td className="p-3">{localOcupantes[index].matricula}</td>
                                        <td className="p-3">{localOcupantes[index].inicio}</td>
                                        <td className="p-3">{localOcupantes[index].fim}</td>
                                    </>
                                ) : (
                                    <>
                                        <td className="p-3">
                                            <input
                                                type="text"
                                                value={localOcupantes[index].nome}
                                                onChange={(e) => handleChange(index, "nome", e.target.value)}
                                                className="w-full px-3 py-1 rounded bg-[color:var(--color-bg)] border border-[color:var(--color-peach)] text-[color:var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-peach)]"
                                                placeholder="Nome"
                                            />
                                        </td>
                                        <td className="p-3">
                                            <input
                                                type="text"
                                                value={localOcupantes[index].matricula}
                                                onChange={(e) => handleChange(index, "matricula", e.target.value)}
                                                className="w-full px-3 py-1 rounded bg-[color:var(--color-bg)] border border-[color:var(--color-peach)] text-[color:var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-peach)]"
                                                placeholder="Matrícula"
                                            />
                                        </td>
                                        <td className="p-3">
                                            <input
                                                type="time"
                                                value={localOcupantes[index].inicio}
                                                onChange={(e) => handleChange(index, "inicio", e.target.value)}
                                                className="w-full px-3 py-1 rounded bg-[color:var(--color-bg)] border border-[color:var(--color-peach)] text-[color:var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-peach)]"
                                            />
                                        </td>
                                        <td className="p-3">
                                            <input
                                                type="time"
                                                value={localOcupantes[index].fim}
                                                onChange={(e) => handleChange(index, "fim", e.target.value)}
                                                className="w-full px-3 py-1 rounded bg-[color:var(--color-bg)] border border-[color:var(--color-peach)] text-[color:var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-peach)]"
                                            />
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScheduleEditor;
