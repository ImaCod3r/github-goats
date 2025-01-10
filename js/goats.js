// Logica dos dados
// Estruturacao dos dados
export class Goats {
    constructor(root) {
        this.root = document.querySelector(root);
        this.load();
    }

    load() {
        this.data = JSON.parse(localStorage.getItem('@github-goats:')) || [];
    }

    delete(target) {
        this.data = this.data.filter(item => (item.username !== target.username));
        console.log(this.data);
        this.update();
    }
}
// Visualizacao e eventos do HTML
export class GoatsView extends Goats {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector('table tbody');
        this.update();
    }

    update() {
        this.removeAllTr();

        this.data.forEach(item => {
            const row = this.createRow(item);

            row.querySelector('.remove-button').onclick = () => {
                let isOk = confirm('Tem certeza que deseja deletar esta linha?');

                if(isOk) {
                    this.delete(item);
                }
            }

            this.tbody.append(row);
        })
    }

    createRow(item) {
        const tr = document.createElement('tr');

        tr.innerHTML = `
                    <td class="user">
                        <img src="https://github.com/${item.username}.png" alt="Profile picture">
                        <a href="https://github.com/${item.username}" target="_blank">
                            <p>${item.name}</p>
                            <span>${item.username}</span>
                        </a>
                    </td>
                    <td class="repositories">
                        ${item.public_repos}
                    </td>
                    <td class="followers">
                        ${item.followers}
                    </td>
                    <td>
                        <button class="remove-button">Delete</button>
                    </td>
        `;

        return tr;
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                tr.remove();
            });
    }
}