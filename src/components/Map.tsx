import React, { useRef, useEffect } from 'react';

const Map = (props:any) => {
  const mapEle = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map>();

  const location = props.location;

  useEffect(() => {

    const lat: number = +location.current.lat;
    const lng: number = +location.current.lng;

    const myLatLng = { lat: lat, lng: lng };

    map.current = new google.maps.Map(mapEle.current, {
      center: myLatLng,
      zoom: 12
    });

    google.maps.event.addListenerOnce(map.current, 'idle', () => {
      if (mapEle.current) {
        mapEle.current.classList.add('show-map');
      }
    });

    addMarkers();

    new google.maps.Marker({
      position: myLatLng,
      map: map.current,
      title: "Hello",
    });

    function addMarkers() {
      location.locations.forEach((markerData:any) => {
        let infoWindow = new google.maps.InfoWindow({
          content: `<h5>${markerData.name}</h5>`
        });

        const otherLat: number = +markerData.lat;
        const otherLng: number = +markerData.lng;

        let marker = new google.maps.Marker({
          position: new google.maps.LatLng(otherLat, otherLng),
          map: map.current!,
          title: markerData.name,
        });

        marker.addListener('click', () => {
          infoWindow.open(map.current!, marker);
        });
      });
    }

  }, [location]);

  return (
    <div ref={mapEle} className="map-canvas"></div>
  );
}

export default Map;
