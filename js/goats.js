import { Githubuser } from "./githubuser.js";

export class Goats {
    constructor(root) {
        this.root = document.querySelector(root);
        this.load();
    }

    load() {
        this.data = JSON.parse(localStorage.getItem('@github-goats:')) || [];
    }

    save() {
        localStorage.setItem('@github-goats:', JSON.stringify(this.data));
    }

    async add(username) {
        try {

            const userExists = this.data.find(entry => entry.login === username);

            if (userExists) {
                throw new Error('User already exists');
            }

            const user = await Githubuser.search(username);

            if (user.login === undefined) {
                throw new Error('Usuario nao encontrado')
            }

            this.data = [user, ...this.data];
            this.update();
            this.save();

        } catch (error) {
            alert(error.message);
        }
    }

    delete(target) {
        this.data = this.data.filter(item => (item.login !== target.login));
        this.update();
        this.save();
    }
}

export class GoatsView extends Goats {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector('table tbody');
        this.update();
        this.onadd();
    }

    onadd() {
        const addButton = this.root.querySelector('.search button');
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input');

            this.add(value);
        }
    }

    update() {
        this.removeAllTr();

        this.data.forEach(item => {
            const row = this.createRow(item);

            row.querySelector('.remove-button').onclick = () => {
                let isOk = confirm('Tem certeza que deseja deletar esta linha?');

                if (isOk) {
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
                        <img src="https://github.com/${item.login}.png" alt="Profile picture">
                        <a href="https://github.com/${item.login}" target="_blank">
                            <p>${item.name}</p>
                            <span>${item.login}</span>
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