document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCadastro');
    const tabelaCadastro = document.getElementById('cadastros');
    const totalRegistros = document.getElementById('totalRegistros');
    const posicoes = {
        esl: "Esquerdo Lateral",
        dil: "Direito Lateral",
        gol: "Goleiro",
        zag: "Zagueiro",
        vol: "Volante",
        mei: "Meia",
        pte: "Ponta Esquerda",
        ptd: "Ponta Direita",
        cta: "Centro Avante"
    };
    let dados = JSON.parse(localStorage.getItem('cadastros')) || [];

    const cpfInput = document.getElementById('cpf');
    cpfInput.addEventListener('input', (event) => {
        const value = event.target.value.replace(/\D+/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
        event.target.value = value;
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const idade = parseInt(document.getElementById('idade').value.trim(), 10);
        const cpf = cpfInput.value.trim();
        const time = document.getElementById('time').value.trim();
        const posicao = document.getElementById('posicao').value;

        if (!validaCPF(cpf)) {
            alert('CPF inválido. Verifique o número digitado.');
            return;
        }

        const cadastro = { nome, idade, cpf, time, posicao };
        dados.push(cadastro);
        localStorage.setItem('cadastros', JSON.stringify(dados));
        atualizarTabela();
        form.reset();
    });

    function validaCPF(cpf) {
        cpf = cpf.replace(/\D+/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

        let soma = 0, resto;
        for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        return resto === parseInt(cpf.substring(10, 11));
    }

    function atualizarTabela() {
        tabelaCadastro.innerHTML = '';
        dados.forEach(({ nome, idade, cpf, time, posicao }) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${nome}</td>
                <td>${idade}</td>
                <td>${cpf}</td>
                <td>${time}</td>
                <td>${posicoes[posicao]}</td>
            `;
            tabelaCadastro.appendChild(row);
        });
        totalRegistros.textContent = dados.length;
    }

    atualizarTabela();
});