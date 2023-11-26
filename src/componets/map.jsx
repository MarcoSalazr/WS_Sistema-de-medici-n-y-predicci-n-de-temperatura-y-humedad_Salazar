import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export default function MapComponent() {
    const position = [19.2491736935973,-103.697359973019];

    return (
        <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>
                    <div>
                    WS-TelematicaSalazar 
                    </div>
                </Popup>
            </Marker>
        </MapContainer>
    );
}
