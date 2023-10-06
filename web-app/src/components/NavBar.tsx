export default function NavBar() {
    return (
        <nav className="navbar is-success p-1">
            <div className="navbar-start">
                <p className="subtitle m-3 has-text-centered has-text-white">Community board</p>
            </div>
            <div className="select m-2 is-flex is-flex-direction-row is-justify-content-space-between">
                <label htmlFor="sorting" className="m-2"
                style={{whiteSpace: "nowrap"}}>
                    Sort by</label>
                <select id="sorting" style={{width: "70%"}}>
                    <option>Latest first</option>
                    <option>Oldest first</option>
                </select>
            </div>
            <div className="select m-2 is-flex is-flex-direction-row is-flex-direction-row is-justify-content-space-between">
                <label htmlFor="categories" className="m-2">Categories</label>
                <select id="categories" style={{width: "70%"}}>
                    <option>All ads</option>
                    <option>Electronics & appliances</option>
                    <option>Clothes & accessories</option>
                    <option>Help & service</option>
                    <option>Building materials & DIY</option>
                    <option>Cars, bikes & parts</option>
                    <option>Beauty & health</option>
                    <option>Other</option>
                </select>
            </div>
        </nav>
    )
}
