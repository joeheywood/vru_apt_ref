export default function Reveal({ id, text = "Default text: Hello from Reveal!" }) {
    return (
        <div id={id}>
            <p>{text}</p>
        </div>
    );
}
