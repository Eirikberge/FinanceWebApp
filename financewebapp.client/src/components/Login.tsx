
const Login: React.FC = () => {

    const Login = async (e: React.FormEvent) => {
        e.preventDefault();

    };

    return (
        <div className="Login">
            <h1>Logg inn</h1>
            <form onSubmit={Login}>
                <label htmlFor="registerInputReg">Brukernavn:</label>
                <div>
                    <input
                        placeholder="Mail"
                    />
                    <br />
                    <input
                        placeholder="Passord"
                    />
                    <br />
                    <button type="submit">Logg inn</button>
                </div>
            </form >
        </div >
    );
};

export default Login;