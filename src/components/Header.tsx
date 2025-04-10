import React from "react";

const Header: React.FC = () => {
    return (
        <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">👮</span>
            <div>
                <h1 className="text-2xl font-bold text-[color:var(--color-peach)] uppercase tracking-wider">
                    Escala dos Postos Noturno


                </h1>
                <p className="text-sm text-[color:var(--color-muted)] uppercase tracking-wide">
                    Escalas dos Postos Fixo da UPI-4
                </p>
            </div>
        </div>
    );
};

export default Header;
